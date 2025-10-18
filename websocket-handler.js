// WebSocket服务器配置
const WebSocket = require('ws');
const url = require('url');

// 房间管理
const rooms = new Map();
const users = new Map();

// WebSocket连接处理函数
function handleWebSocketConnection(ws, request) {
    console.log('新的WebSocket连接');
    
    let currentUser = null;
    let currentRoom = null;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('收到消息:', data.type);

            switch (data.type) {
                case 'joinRoom':
                    handleJoinRoom(ws, data);
                    break;
                case 'leaveRoom':
                    handleLeaveRoom(ws, data);
                    break;
                case 'videoSync':
                    handleVideoSync(ws, data);
                    break;
                case 'chatMessage':
                    handleChatMessage(ws, data);
                    break;
                case 'videoUpload':
                    handleVideoUpload(ws, data);
                    break;
                case 'videoSelect':
                    handleVideoSelect(ws, data);
                    break;
                case 'videoDelete':
                    handleVideoDelete(ws, data);
                    break;
                case 'reaction':
                    handleReaction(ws, data);
                    break;
                case 'danmaku':
                    handleDanmaku(ws, data);
                    break;
                case 'requestSync':
                    handleRequestSync(ws, data);
                    break;
                default:
                    console.log('未知消息类型:', data.type);
            }
        } catch (error) {
            console.error('处理消息错误:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: '消息格式错误'
            }));
        }
    });

    ws.on('close', () => {
        console.log('WebSocket连接关闭');
        if (currentUser && currentRoom) {
            handleUserDisconnect(currentUser, currentRoom);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket错误:', error);
    });

    // 处理用户加入房间
    function handleJoinRoom(ws, data) {
        const { roomId, userName } = data;
        
        if (!roomId || !userName) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '房间ID和用户名不能为空'
            }));
            return;
        }

        // 创建或获取房间
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                id: roomId,
                members: new Map(),
                videos: [],
                currentVideo: null,
                createdAt: new Date()
            });
        }

        const room = rooms.get(roomId);
        
        // 检查房间人数限制
        if (room.members.size >= 2) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '房间已满'
            }));
            return;
        }

        // 创建用户
        const user = {
            id: generateUserId(),
            name: userName,
            ws: ws,
            roomId: roomId,
            joinedAt: new Date()
        };

        // 添加用户到房间
        room.members.set(user.id, user);
        users.set(user.id, user);
        
        currentUser = user;
        currentRoom = room;

        // 发送加入成功消息
        ws.send(JSON.stringify({
            type: 'roomJoined',
            roomId: roomId,
            userId: user.id,
            userName: user.name,
            members: Array.from(room.members.values()).map(member => ({
                id: member.id,
                name: member.name
            })),
            memberCount: room.members.size,
            maxMembers: 2
        }));

        // 通知其他成员
        broadcastToRoom(room, {
            type: 'memberJoined',
            user: {
                id: user.id,
                name: user.name
            },
            memberCount: room.members.size,
            maxMembers: 2
        }, user.id);

        console.log(`用户 ${userName} 加入房间 ${roomId}`);
    }

    // 处理用户离开房间
    function handleLeaveRoom(ws, data) {
        if (currentUser && currentRoom) {
            handleUserDisconnect(currentUser, currentRoom);
        }
    }

    // 处理视频同步
    function handleVideoSync(ws, data) {
        if (!currentUser || !currentRoom) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '未加入房间'
            }));
            return;
        }

        const { action, currentTime, duration } = data;
        
        // 广播同步消息给其他成员
        broadcastToRoom(currentRoom, {
            type: 'videoSync',
            action: action,
            currentTime: currentTime,
            duration: duration,
            fromUser: currentUser.id
        }, currentUser.id);
    }

    // 处理聊天消息
    function handleChatMessage(ws, data) {
        if (!currentUser || !currentRoom) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '未加入房间'
            }));
            return;
        }

        const { message, messageType = 'text' } = data;
        
        const chatMessage = {
            type: 'chatMessage',
            message: message,
            messageType: messageType,
            fromUser: {
                id: currentUser.id,
                name: currentUser.name
            },
            timestamp: new Date().toISOString()
        };

        // 广播消息给房间所有成员
        broadcastToRoom(currentRoom, chatMessage);
    }

    // 处理视频上传
    function handleVideoUpload(ws, data) {
        if (!currentUser || !currentRoom) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '未加入房间'
            }));
            return;
        }

        const { videoInfo } = data;
        
        // 添加视频到房间列表
        currentRoom.videos.push({
            id: generateVideoId(),
            ...videoInfo,
            uploadedBy: currentUser.id,
            uploadedAt: new Date()
        });

        // 广播上传消息
        broadcastToRoom(currentRoom, {
            type: 'videoUploaded',
            video: videoInfo,
            fromUser: currentUser.id
        });
    }

    // 处理视频选择
    function handleVideoSelect(ws, data) {
        if (!currentUser || !currentRoom) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '未加入房间'
            }));
            return;
        }

        const { videoId } = data;
        
        // 设置当前视频
        currentRoom.currentVideo = videoId;

        // 广播选择消息
        broadcastToRoom(currentRoom, {
            type: 'videoSelected',
            videoId: videoId,
            fromUser: currentUser.id
        });
    }

    // 处理视频删除
    function handleVideoDelete(ws, data) {
        if (!currentUser || !currentRoom) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '未加入房间'
            }));
            return;
        }

        const { videoId } = data;
        
        // 从房间列表中删除视频
        currentRoom.videos = currentRoom.videos.filter(video => video.id !== videoId);

        // 如果删除的是当前播放的视频
        if (currentRoom.currentVideo === videoId) {
            currentRoom.currentVideo = null;
        }

        // 广播删除消息
        broadcastToRoom(currentRoom, {
            type: 'videoDeleted',
            videoId: videoId,
            fromUser: currentUser.id
        });
    }

    // 处理反应
    function handleReaction(ws, data) {
        if (!currentUser || !currentRoom) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '未加入房间'
            }));
            return;
        }

        const { reaction } = data;
        
        // 广播反应消息
        broadcastToRoom(currentRoom, {
            type: 'reaction',
            reaction: reaction,
            fromUser: {
                id: currentUser.id,
                name: currentUser.name
            }
        });
    }

    // 处理弹幕
    function handleDanmaku(ws, data) {
        if (!currentUser || !currentRoom) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '未加入房间'
            }));
            return;
        }

        const { text, color = '#ffffff', position = 'scroll' } = data;
        
        // 广播弹幕消息
        broadcastToRoom(currentRoom, {
            type: 'danmaku',
            text: text,
            color: color,
            position: position,
            fromUser: currentUser.id
        });
    }

    // 处理同步请求
    function handleRequestSync(ws, data) {
        if (!currentUser || !currentRoom) {
            ws.send(JSON.stringify({
                type: 'error',
                message: '未加入房间'
            }));
            return;
        }

        // 广播同步请求给其他成员
        broadcastToRoom(currentRoom, {
            type: 'requestSync',
            fromUser: {
                id: currentUser.id,
                name: currentUser.name
            }
        }, currentUser.id);
    }

    // 处理用户断开连接
    function handleUserDisconnect(user, room) {
        // 从房间中移除用户
        room.members.delete(user.id);
        users.delete(user.id);

        // 通知其他成员
        broadcastToRoom(room, {
            type: 'memberLeft',
            user: {
                id: user.id,
                name: user.name
            },
            memberCount: room.members.size,
            maxMembers: 2
        });

        // 如果房间为空，删除房间
        if (room.members.size === 0) {
            rooms.delete(room.id);
            console.log(`房间 ${room.id} 已删除`);
        }

        console.log(`用户 ${user.name} 离开房间 ${room.id}`);
    }

    // 广播消息给房间成员
    function broadcastToRoom(room, message, excludeUserId = null) {
        room.members.forEach((member) => {
            if (member.id !== excludeUserId && member.ws.readyState === WebSocket.OPEN) {
                member.ws.send(JSON.stringify(message));
            }
        });
    }
}

// 生成用户ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// 生成视频ID
function generateVideoId() {
    return 'video_' + Math.random().toString(36).substr(2, 9);
}

// 获取房间信息
function getRoomInfo(roomId) {
    const room = rooms.get(roomId);
    if (!room) return null;
    
    return {
        id: room.id,
        members: Array.from(room.members.values()).map(member => ({
            id: member.id,
            name: member.name
        })),
        memberCount: room.members.size,
        maxMembers: 2,
        videos: room.videos,
        currentVideo: room.currentVideo,
        createdAt: room.createdAt
    };
}

module.exports = {
    handleWebSocketConnection,
    getRoomInfo,
    rooms,
    users
};