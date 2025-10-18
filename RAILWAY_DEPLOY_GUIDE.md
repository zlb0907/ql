# 🚂 Railway 部署指南

本指南将帮助你将后端服务部署到 Railway 平台。

## 📋 前提条件

- 已注册 Railway 账号
- 已连接 GitHub 账号到 Railway
- 已完成前端 Netlify 部署

## 🚀 部署步骤

### 步骤 1：创建新项目

1. 访问 [railway.app](https://railway.app)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择你的情侣同步观影应用仓库

### 步骤 2：配置服务

1. 选择 "Deploy NodeJS Server"
2. 配置环境变量：
   ```
   NODE_ENV=production
   PORT=3000
   ```
3. 确认构建和启动命令：
   - Build Command: `npm install`
   - Start Command: `npm start`

### 步骤 3：部署

1. 点击 "Deploy" 开始部署
2. 等待部署完成（通常需要 2-5 分钟）
3. 获取分配的域名（格式：`xxx.up.railway.app`）

### 步骤 4：更新前端配置

部署完成后，需要更新前端配置：

1. 修改 `index.html`：
   ```javascript
   // 将 railway URL 替换为你实际的 Railway 域名
   railway: 'wss://your-app-name.up.railway.app/ws',
   ```

2. 修改 `netlify.toml`：
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-app-name.up.railway.app/api/:splat"
     status = 200
   
   [[redirects]]
     from = "/ws"
     to = "wss://your-app-name.up.railway.app"
     status = 200
   ```

## 🔧 环境变量配置

在 Railway 控制台中添加以下环境变量：

```
NODE_ENV=production
PORT=3000
# 可选：数据库配置（如果需要）
# DATABASE_URL=your_database_url
```

## 🧪 测试部署

### 1. 健康检查
访问：`https://your-app-name.up.railway.app/api/health`

应该返回：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. WebSocket 测试
使用在线 WebSocket 测试工具连接：
`wss://your-app-name.up.railway.app/ws`

## 📊 监控和日志

- 在 Railway 控制台查看实时日志
- 监控资源使用情况（CPU、内存、网络）
- 设置告警通知（可选）

## 💰 费用说明

**免费套餐**：
- 500 小时/月免费使用时间
- 512MB 内存
- 共享 CPU
- 1GB 磁盘空间

**付费套餐**：
- $5/月起，根据资源使用情况计费
- 更多内存和 CPU 选项
- 优先支持

## 🆘 常见问题

### 部署失败
1. 检查 package.json 中的依赖是否正确
2. 确认所有文件已提交到 Git
3. 查看 Railway 控制台日志获取详细错误
4. 确保端口配置正确（Railway 会自动分配端口）

### WebSocket 连接失败
1. 确认 WebSocket URL 格式正确（wss://）
2. 检查 CORS 配置是否允许跨域
3. 验证 Railway 服务是否正常运行
4. 检查防火墙设置

### 服务休眠
- Railway 免费套餐在无请求 30 分钟后会休眠
- 首次访问需要 10-30 秒唤醒时间
- 建议使用付费套餐避免休眠

### 内存不足
- 免费套餐只有 512MB 内存
- 如果应用占用内存过多，考虑升级到付费套餐
- 优化代码减少内存使用

## 🎯 验证成功

部署成功后，你应该能够：
1. 访问前端 Netlify 站点
2. 创建/加入房间
3. 视频同步播放功能正常
4. 聊天功能正常工作
5. WebSocket 连接稳定

## 📞 获取帮助

- Railway 官方文档：[docs.railway.app](https://docs.railway.app)
- Railway Discord 社区
- GitHub Issues 支持

---

🎉 **恭喜！现在你的后端服务已经成功部署到 Railway！**