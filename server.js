const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const { handleWebSocketConnection } = require('./websocket-handler.js');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 启用CORS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 房间管理
const rooms = new Map();
const users = new Map();

// WebSocket连接处理
wss.on('connection', (ws, req) => {
    handleWebSocketConnection(ws, req);
});

// 获取房间信息API
app.get('/api/room/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { getRoomInfo } = require('./websocket-handler.js');
    const roomInfo = getRoomInfo(roomId);
    
    if (!roomInfo) {
        return res.status(404).json({ error: '房间不存在' });
    }

    res.json(roomInfo);
});

// 健康检查API
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 获取房间列表API
app.get('/api/rooms', (req, res) => {
    const { rooms } = require('./websocket-handler.js');
    const roomList = Array.from(rooms.values()).map(room => ({
        id: room.id,
        memberCount: room.members.size,
        maxMembers: 2,
        createdAt: room.createdAt
    }));
    
    res.json(roomList);
});

// 端口配置
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`WebSocket服务器已启动`);
});

module.exports = { app, server, wss };