# 部署指南

本指南将帮助你部署情侣同步观影应用到Netlify和GitHub。

## 🚀 快速部署流程

### 1. 准备GitHub仓库

1. 在GitHub上创建新仓库
2. 将本地代码推送到GitHub
3. 确保包含以下文件：
   - `public/index.html`
   - `server.js`
   - `websocket-handler.js`
   - `netlify/functions/api.js`
   - `package.json`
   - `netlify.toml`
   - `README.md`
   - `LICENSE`
   - `.gitignore`

### 2. 部署前端到Netlify

#### 方法一：通过GitHub连接
1. 访问 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择GitHub并授权
4. 选择你的项目仓库
5. 设置构建配置：
   - Build command: `npm install && npm run build`
   - Publish directory: `public`
6. 点击 "Deploy site"

#### 方法二：手动部署
1. 打包项目：`npm run build`
2. 访问 [Netlify Drop](https://app.netlify.com/drop)
3. 拖拽打包后的`public`文件夹
4. 自动生成URL并部署

### 3. 部署后端到Render (推荐免费方案)

1. 访问 [Render](https://render.com)
2. 注册账号并登录
3. 点击 "New Web Service"
4. 连接GitHub仓库
5. 配置部署设置：
   - Name: `video-sync-server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - `NODE_ENV=production`
     - `PORT=10000` (Render默认端口)
6. 点击 "Create Web Service"
7. 等待部署完成，获取服务URL

### 4. 配置WebSocket连接

1. 在`public/index.html`中找到`getWebSocketUrl()`函数
2. 将`your-websocket-server.onrender.com`替换为你的实际Render服务URL
3. 示例：
   ```javascript
   if (window.location.hostname.includes('netlify.app')) {
     return 'wss://video-sync-server-xxx.onrender.com/ws';
   }
   ```

### 5. 更新Netlify配置

在`netlify.toml`中更新WebSocket重定向：
```toml
[[redirects]]
  from = "/ws"
  to = "https://your-render-url.onrender.com/ws"
  status = 200
  force = true
```

## 🔧 详细配置说明

### 环境变量配置

#### Render环境变量
```bash
NODE_ENV=production
PORT=10000
WEBSOCKET_PORT=10000
```

#### Netlify环境变量 (可选)
在Netlify控制台设置：
```bash
NODE_VERSION=18
NETLIFY_SITE_ID=your-site-id
NETLIFY_ACCESS_TOKEN=your-access-token
```

### 域名配置

#### 自定义域名
1. 在Netlify中添加自定义域名
2. 配置DNS记录指向Netlify
3. 在Render中同样配置自定义域名
4. 更新前端WebSocket URL配置

#### SSL证书
Netlify和Render都会自动提供SSL证书，无需额外配置。

## 📋 部署检查清单

### 部署前检查
- [ ] 所有依赖已安装 (`npm install`)
- [ ] 本地测试通过 (`npm run dev`)
- [ ] WebSocket连接正常
- [ ] 前端页面加载正常
- [ ] 所有文件已提交到Git

### 部署后验证
- [ ] Netlify站点可以正常访问
- [ ] Render服务运行正常
- [ ] WebSocket连接成功
- [ ] 可以创建房间
- [ ] 可以加入房间
- [ ] 视频同步功能正常
- [ ] 聊天功能正常

## 🔍 常见问题解决

### WebSocket连接失败
1. 检查Render服务状态
2. 确认WebSocket URL配置正确
3. 检查浏览器控制台错误信息
4. 验证网络连接

### 前端部署失败
1. 检查构建命令是否正确
2. 确认发布目录设置为`public`
3. 查看Netlify构建日志
4. 确认所有必需文件已上传

### 后端部署失败
1. 检查package.json中的脚本
2. 确认端口配置正确
3. 查看Render部署日志
4. 验证环境变量设置

### 跨域问题
确保后端配置了正确的CORS设置：
```javascript
app.use(cors({
  origin: ['https://your-frontend.netlify.app'],
  credentials: true
}));
```

## 🚀 高级配置

### 性能优化
1. 启用CDN加速
2. 配置缓存策略
3. 压缩静态资源
4. 使用图片优化

### 监控和日志
1. 设置应用监控
2. 配置错误日志
3. 设置性能监控
4. 配置告警通知

### 扩展功能
1. 用户认证系统
2. 房间管理后台
3. 视频推荐算法
4. 多语言支持

## 📞 技术支持

如果遇到问题：
1. 查看项目Issues
2. 检查部署日志
3. 验证配置文件
4. 联系技术支持

---

🎉 恭喜！完成以上步骤后，你的情侣同步观影应用就成功部署了！