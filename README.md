# 情侣同步观影应用

一个基于WebSocket的实时视频同步观看应用，让情侣可以一起在线观看视频，保持播放进度同步。

## 🌟 功能特性

- 🎥 **视频同步播放** - 实时同步播放、暂停、进度
- 💬 **实时聊天** - 内置聊天功能，支持弹幕
- ❤️ **互动反应** - 发送爱心等互动表情
- 📺 **播放列表管理** - 添加、删除、切换视频
- 👥 **房间系统** - 创建房间，邀请伴侣加入
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🎨 **精美UI** - 现代化界面，支持深色主题

## 🚀 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone <your-repo-url>
cd video-sync-app
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:3000`

### 生产部署

#### 前端部署 (Netlify)

1. **连接GitHub仓库到Netlify**
2. **设置构建配置**:
   - Build command: `npm run build`
   - Publish directory: `public`
3. **部署**

#### 后端部署 (Render/Railway/Heroku)

由于Netlify不支持WebSocket，需要将后端部署到支持WebSocket的平台：

1. **部署到Render** (免费):
   - 连接GitHub仓库
   - 选择Web Service
   - 设置环境变量: `NODE_ENV=production`
   - 部署

2. **更新前端WebSocket地址**:
   在 `public/index.html` 中修改 `getWebSocketUrl()` 函数:
   ```javascript
   if (window.location.hostname.includes('netlify.app')) {
     return 'wss://your-app-name.onrender.com/ws';
   }
   ```

## 📁 项目结构

```
video-sync-app/
├── public/                    # 前端静态文件
│   └── index.html            # 主页面
├── netlify/                  # Netlify Functions
│   └── functions/
│       └── api.js            # API函数包装
├── server.js                 # Express服务器
├── websocket-handler.js      # WebSocket处理逻辑
├── package.json              # 项目配置
├── netlify.toml              # Netlify配置
└── README.md                 # 项目文档
```

## 🔧 技术栈

- **前端**: HTML5, Tailwind CSS, Font Awesome, Anime.js
- **后端**: Node.js, Express, WebSocket (ws)
- **部署**: Netlify (前端), Render/Railway (后端)
- **实时通信**: WebSocket

## 📖 API文档

### WebSocket消息类型

#### 客户端发送
- `CREATE_ROOM` - 创建房间
- `JOIN_ROOM` - 加入房间
- `LEAVE_ROOM` - 离开房间
- `VIDEO_SYNC` - 同步视频
- `PLAY_PAUSE_SYNC` - 播放状态同步
- `PROGRESS_SYNC` - 进度同步
- `CHAT_MESSAGE` - 聊天消息
- `REACTION` - 互动反应

#### 服务器响应
- `ROOM_CREATED` - 房间创建成功
- `JOINED_ROOM` - 加入房间成功
- `PARTNER_JOINED` - 伴侣加入
- `PARTNER_LEFT` - 伴侣离开
- `VIDEO_SYNC` - 视频同步
- `PLAY_PAUSE_SYNC` - 播放状态同步
- `PROGRESS_SYNC` - 进度同步
- `CHAT_MESSAGE` - 聊天消息
- `REACTION` - 互动反应

## 🎯 使用说明

### 创建房间
1. 点击"创建房间"按钮
2. 复制房间ID给伴侣
3. 等待伴侣加入

### 加入房间
1. 输入伴侣分享的房间ID
2. 点击"加入房间"
3. 开始同步观影

### 同步观影
- 房主可以控制播放、暂停、进度
- 访客会自动同步房主的操作
- 双方可以实时聊天和发送互动表情

## 🔧 配置说明

### 环境变量
- `NODE_ENV` - 环境 (development/production)
- `PORT` - 服务器端口 (默认3000)

### Netlify配置
在 `netlify.toml` 文件中配置:
- 构建命令
- 重定向规则
- HTTP头设置
- 环境变量

## 🐛 常见问题

### WebSocket连接失败
1. 检查后端服务是否正常运行
2. 确认WebSocket地址配置正确
3. 检查防火墙和网络设置

### 视频无法播放
1. 确认视频URL有效
2. 检查视频格式是否支持
3. 确认跨域设置正确

### 同步延迟
1. 检查网络连接质量
2. 减少视频分辨率
3. 使用CDN加速

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Font Awesome](https://fontawesome.com/) - 图标库
- [Anime.js](https://animejs.com/) - 动画库

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 创建 Pull Request

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！