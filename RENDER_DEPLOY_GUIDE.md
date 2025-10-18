# 🚀 Render后端部署指南

## 步骤1：访问Render官网

1. 打开浏览器访问 [https://render.com](https://render.com)
2. 点击右上角的 "Sign Up" 注册账号（可以使用GitHub账号直接登录）
3. 完成邮箱验证

## 步骤2：创建Web Service

1. 登录后点击仪表板上的 "New" 按钮
2. 选择 "Web Service"
3. 选择 "Build and deploy from a Git repository"
4. 点击 "Next"

## 步骤3：连接GitHub仓库

1. 点击 "Connect GitHub"（如果还没连接）
2. 授权Render访问你的GitHub账号
3. 在仓库列表中找到你的项目（couple-sync-movie 或类似名称）
4. 点击 "Connect" 连接该仓库

## 步骤4：配置部署设置

填写以下配置信息：

### 基本信息
- **Name**: `couple-sync-video-server`（或你喜欢的名称）
- **Branch**: `main`（或你的主分支）
- **Root Directory**: `./`（保持默认）
- **Environment**: `Node`

### 构建设置
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 实例类型
- 选择 "Free"（免费套餐）
- 或者选择适合的付费套餐

## 步骤5：配置环境变量

点击 "Advanced" 展开高级设置，添加以下环境变量：

```
NODE_ENV=production
PORT=10000
```

## 步骤6：创建服务

1. 点击 "Create Web Service" 按钮
2. 等待部署完成（通常需要2-5分钟）

## 步骤7：获取服务URL

部署完成后，你会看到类似这样的URL：
```
https://couple-sync-video-server-xxx.onrender.com
```

复制这个URL，下一步需要用它来配置前端。

## 🔧 验证部署

部署完成后，可以通过以下方式验证：

1. 访问健康检查API：
   ```
   https://your-app-name.onrender.com/api/health
   ```
   应该返回：
   ```json
   {"status":"ok","timestamp":"2024-..."}
   ```

2. 测试WebSocket连接（可以使用在线WebSocket测试工具）

## 📋 重要提醒

### 免费套餐限制
- 每月750小时免费使用时间
- 15分钟后无请求会自动休眠
- 休眠后首次访问需要10-30秒唤醒时间

### 保持服务活跃
- 可以设置定时任务每10分钟ping一次服务
- 或者升级到付费套餐避免休眠

### 日志查看
- 在Render控制台可以查看实时日志
- 有助于调试部署问题

## 🚀 下一步

部署完成后，请继续配置前端WebSocket连接：
1. 更新前端代码中的WebSocket URL
2. 配置Netlify重定向规则
3. 测试完整的同步观影功能

## 🆘 常见问题

### 部署失败
- 检查package.json中的依赖是否正确
- 确认所有必需文件已提交到Git
- 查看Render控制台日志获取详细错误信息

### WebSocket连接失败
- 确认WebSocket URL格式正确（wss://）
- 检查CORS配置
- 验证端口设置

### 服务休眠
- 这是免费套餐的正常行为
- 首次访问会稍慢
- 考虑设置保活机制

---

🎉 恭喜！完成以上步骤后，你的后端服务就成功部署到Render了！

接下来请继续配置前端连接。