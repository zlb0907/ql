// 情侣同步观影应用 - 前端主程序
class CoupleSyncApp {
    constructor() {
        this.currentRoom = null;
        this.currentUser = null;
        this.ws = null;
        this.users = new Map();
        this.videoElement = null;
        this.isSyncing = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateUserAvatar();
        this.showNotification('欢迎使用情侣同步观影！', 'success');
    }

    // 设置事件监听器
    setupEventListeners() {
        // 房间操作
        document.getElementById('createRoomBtn').addEventListener('click', () => this.createRoom());
        document.getElementById('joinRoomBtn').addEventListener('click', () => this.joinRoom());
        
        // 聊天功能
        document.getElementById('sendMessageBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // 视频同步
        document.getElementById('syncPlayBtn').addEventListener('click', () => this.syncPlay());
        document.getElementById('syncPauseBtn').addEventListener('click', () => this.syncPause());
        document.getElementById('syncSeekBtn').addEventListener('click', () => this.syncSeek());
        
        // 房间号复制
        document.getElementById('copyRoomId').addEventListener('click', () => this.copyRoomId());
        
        // 反应表情
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.sendReaction(e.target.dataset.reaction));
        });
        
        // 视频播放器事件
        this.videoElement = document.getElementById('videoPlayer');
        this.setupVideoListeners();
        
        // 用户名输入
        document.getElementById('userName').addEventListener('input', (e) => {
            this.updateUsername(e.target.value);
        });
    }

    // 设置视频监听器
    setupVideoListeners() {
        this.videoElement.addEventListener('play', () => {
            if (!this.isSyncing && this.ws) {
                this.broadcastVideoState('play', this.videoElement.currentTime);
            }
        });
        
        this.videoElement.addEventListener('pause', () => {
            if (!this.isSyncing && this.ws) {
                this.broadcastVideoState('pause', this.videoElement.currentTime);
            }
        });
        
        this.videoElement.addEventListener('seeked', () => {
            if (!this.isSyncing && this.ws) {
                this.broadcastVideoState('seek', this.videoElement.currentTime);
            }
        });
    }

    // 创建房间
    async createRoom() {
        const userName = document.getElementById('userName').value.trim() || '用户';
        const roomId = document.getElementById('roomId').value.trim() || this.generateRoomId();
        
        this.currentUser = {
            id: this.generateUserId(),
            name: userName,
            avatar: this.generateUserAvatar()
        };
        
        this.currentRoom = roomId;
        this.connectWebSocket(roomId);
        this.showRoomInterface();
        this.showNotification(`房间 ${roomId} 创建成功！`, 'success');
    }

    // 加入房间
    async joinRoom() {
        const userName = document.getElementById('userName').value.trim() || '用户';
        const roomId = document.getElementById('roomId').value.trim();
        
        if (!roomId) {
            this.showNotification('请输入房间号', 'error');
            return;
        }
        
        this.currentUser = {
            id: this.generateUserId(),
            name: userName,
            avatar: this.generateUserAvatar()
        };
        
        this.currentRoom = roomId;
        this.connectWebSocket(roomId);
        this.showRoomInterface();
        this.showNotification(`成功加入房间 ${roomId}！`, 'success');
    }

    // 连接WebSocket
    connectWebSocket(roomId) {
        // 生产环境使用实际WebSocket地址
        const wsUrl = window.location.protocol === 'https:' 
            ? `wss://${window.location.host}/ws` 
            : `ws://localhost:3000`;
            
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
            console.log('WebSocket连接成功');
            this.sendMessageToServer({
                type: 'join',
                roomId: roomId,
                user: this.currentUser
            });
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
        };
        
        this.ws.onclose = () => {
            console.log('WebSocket连接关闭');
            this.showNotification('连接已断开', 'error');
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket错误:', error);
            this.showNotification('连接错误', 'error');
        };
    }

    // 处理WebSocket消息
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'userJoined':
                this.handleUserJoined(data.user);
                break;
            case 'userLeft':
                this.handleUserLeft(data.userId);
                break;
            case 'usersList':
                this.updateUsersList(data.users);
                break;
            case 'chatMessage':
                this.handleChatMessage(data);
                break;
            case 'videoSync':
                this.handleVideoSync(data);
                break;
            case 'reaction':
                this.handleReaction(data);
                break;
            case 'syncRequest':
                this.handleSyncRequest(data);
                break;
        }
    }

    // 用户加入
    handleUserJoined(user) {
        this.users.set(user.id, user);
        this.updateUsersListDisplay();
        this.showNotification(`${user.name} 加入了房间`, 'info');
    }

    // 用户离开
    handleUserLeft(userId) {
        const user = this.users.get(userId);
        if (user) {
            this.users.delete(userId);
            this.updateUsersListDisplay();
            this.showNotification(`${user.name} 离开了房间`, 'info');
        }
    }

    // 更新用户列表
    updateUsersList(users) {
        this.users.clear();
        users.forEach(user => {
            this.users.set(user.id, user);
        });
        this.updateUsersListDisplay();
    }

    // 更新用户列表显示
    updateUsersListDisplay() {
        const usersList = document.getElementById('usersList');
        const userCount = document.getElementById('userCount');
        
        userCount.textContent = this.users.size;
        
        usersList.innerHTML = '';
        this.users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.innerHTML = `
                <div class="avatar">${user.avatar}</div>
                <span>${user.name}</span>
            `;
            usersList.appendChild(userElement);
        });
    }

    // 发送聊天消息
    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message || !this.ws) return;
        
        const messageData = {
            type: 'chatMessage',
            roomId: this.currentRoom,
            user: this.currentUser,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        this.sendMessageToServer(messageData);
        messageInput.value = '';
    }

    // 处理聊天消息
    handleChatMessage(data) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        
        const time = new Date(data.timestamp).toLocaleTimeString();
        messageElement.innerHTML = `
            <div class="message-author">${data.user.name} <span class="message-time">${time}</span></div>
            <div class="message-content">${data.message}</div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 视频同步功能
    syncPlay() {
        if (this.ws && this.videoElement) {
            this.broadcastVideoState('play', this.videoElement.currentTime);
            this.showNotification('已发送同步播放指令', 'success');
        }
    }

    syncPause() {
        if (this.ws && this.videoElement) {
            this.broadcastVideoState('pause', this.videoElement.currentTime);
            this.showNotification('已发送同步暂停指令', 'success');
        }
    }

    syncSeek() {
        if (this.ws && this.videoElement) {
            this.broadcastVideoState('seek', this.videoElement.currentTime);
            this.showNotification('已发送同步进度指令', 'success');
        }
    }

    // 广播视频状态
    broadcastVideoState(action, time) {
        const syncData = {
            type: 'videoSync',
            roomId: this.currentRoom,
            action: action,
            time: time,
            user: this.currentUser
        };
        
        this.sendMessageToServer(syncData);
    }

    // 处理视频同步
    handleVideoSync(data) {
        if (data.user.id === this.currentUser.id) return; // 忽略自己的同步消息
        
        this.isSyncing = true;
        
        switch (data.action) {
            case 'play':
                this.videoElement.currentTime = data.time;
                this.videoElement.play();
                break;
            case 'pause':
                this.videoElement.currentTime = data.time;
                this.videoElement.pause();
                break;
            case 'seek':
                this.videoElement.currentTime = data.time;
                break;
        }
        
        setTimeout(() => {
            this.isSyncing = false;
        }, 100);
        
        this.showNotification(`${data.user.name} 同步了视频`, 'info');
    }

    // 发送反应表情
    sendReaction(reaction) {
        if (!this.ws) return;
        
        const reactionData = {
            type: 'reaction',
            roomId: this.currentRoom,
            user: this.currentUser,
            reaction: reaction
        };
        
        this.sendMessageToServer(reactionData);
        this.showFloatingReaction(reaction);
    }

    // 处理反应表情
    handleReaction(data) {
        if (data.user.id === this.currentUser.id) return;
        
        this.showNotification(`${data.user.name} 发送了 ${data.reaction}`, 'info');
        this.showFloatingReaction(data.reaction);
    }

    // 显示浮动表情
    showFloatingReaction(reaction) {
        const container = document.getElementById('floatingReactions');
        const reactionElement = document.createElement('div');
        reactionElement.className = 'floating-reaction';
        reactionElement.textContent = reaction;
        
        // 随机位置
        reactionElement.style.left = Math.random() * (window.innerWidth - 100) + 'px';
        reactionElement.style.top = window.innerHeight - 100 + 'px';
        
        container.appendChild(reactionElement);
        
        // 3秒后移除
        setTimeout(() => {
            reactionElement.remove();
        }, 3000);
    }

    // 复制房间号
    copyRoomId() {
        const roomId = this.currentRoom;
        navigator.clipboard.writeText(roomId).then(() => {
            this.showNotification('房间号已复制到剪贴板', 'success');
        }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = roomId;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('房间号已复制到剪贴板', 'success');
        });
    }

    // 显示房间界面
    showRoomInterface() {
        document.getElementById('roomSelection').style.display = 'none';
        document.getElementById('viewingRoom').style.display = 'grid';
        document.getElementById('currentRoomId').textContent = this.currentRoom;
        
        // 设置视频源（示例视频，实际使用中可以动态加载）
        this.videoElement.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
    }

    // 生成用户头像
    generateUserAvatar() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        const avatar = document.getElementById('userAvatar');
        const username = document.getElementById('userName').value.trim() || '用户';
        const initial = username.charAt(0).toUpperCase();
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        avatar.textContent = initial;
        avatar.style.background = color;
        
        return initial;
    }

    // 更新用户名
    updateUsername(name) {
        document.getElementById('username').textContent = name;
        this.generateUserAvatar();
    }

    // 生成房间号
    generateRoomId() {
        return Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    // 生成用户ID
    generateUserId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 发送消息到服务器
    sendMessageToServer(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notifications.appendChild(notification);
        
        // 3秒后移除
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new CoupleSyncApp();
});

// 页面卸载时关闭WebSocket
window.addEventListener('beforeunload', () => {
    if (window.app && window.app.ws) {
        window.app.ws.close();
    }
});