# 🚀 GitHub仓库创建和代码推送指南

## 📋 步骤1：创建GitHub仓库

### 在GitHub网站上创建：
1. 访问 [github.com](https://github.com)
2. 点击右上角的 "+" 按钮 → "New repository"
3. 填写仓库信息：
   - **Repository name**: `couple-sync-video` (或你喜欢的名字)
   - **Description**: `情侣同步观影应用 - 实时视频同步和聊天功能`
   - **Public/Private**: 选择 Public (免费) 或 Private (需要付费)
   - **Initialize repository**: ❌ 不要勾选任何选项
4. 点击 "Create repository"

## 📋 步骤2：本地Git配置

### 配置Git用户信息（如果还没配置）：
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

## 📋 步骤3：添加和提交代码

### 添加所有文件到暂存区：
```bash
git add .
```

### 提交代码：
```bash
git commit -m "Initial commit: 情侣同步观影应用

功能特性：
- 实时视频同步播放
- WebSocket实时聊天
- 用户头像生成
- 反应表情系统
- 房间管理功能

技术栈：
- Node.js + Express
- WebSocket (ws库)
- Netlify + Render部署
- 响应式设计"
```

## 📋 步骤4：推送到GitHub

### 方法1：使用HTTPS（推荐新手）
```bash
# 添加远程仓库（替换YOUR_USERNAME和YOUR_REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送到main分支
git branch -M main
git push -u origin main
```

### 方法2：使用SSH（需要配置SSH密钥）
```bash
# 添加远程仓库（替换YOUR_USERNAME和YOUR_REPO_NAME）
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送到main分支
git branch -M main
git push -u origin main
```

## 📋 步骤5：验证推送成功

### 检查远程连接：
```bash
git remote -v
```

### 查看分支状态：
```bash
git status
git log --oneline -5
```

## 🎯 一键执行脚本

如果你想快速完成所有步骤，可以运行这个脚本：

```bash
#!/bin/bash
echo "🚀 开始GitHub推送流程..."

# 检查Git配置
if [ -z "$(git config user.name)" ]; then
    echo "请输入你的Git用户名:"
    read username
    git config --global user.name "$username"
fi

if [ -z "$(git config user.email)" ]; then
    echo "请输入你的Git邮箱:"
    read email
    git config --global user.email "$email"
fi

# 添加和提交
echo "📦 添加文件..."
git add .

echo "💾 提交代码..."
git commit -m "Initial commit: 情侣同步观影应用"

# 获取仓库信息
echo "请输入你的GitHub仓库URL:"
echo "格式: https://github.com/USERNAME/REPO_NAME.git"
read repo_url

# 添加远程仓库
git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"

# 推送
echo "🚀 推送到GitHub..."
git branch -M main
git push -u origin main

echo "✅ 完成！请访问你的GitHub仓库查看代码。"
```

## 🔧 常见问题解决

### 问题1：认证失败
```bash
# 更新远程仓库URL
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 或者使用SSH
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 问题2：分支冲突
```bash
# 强制推送（谨慎使用）
git push -f origin main

# 或者先拉取远程更改
git pull origin main --allow-unrelated-histories
git push origin main
```

### 问题3：大文件问题
```bash
# 检查大文件
git ls-files | xargs ls -la | sort -k5 -nr | head -10

# 如果package-lock.json太大，可以忽略
echo "package-lock.json" >> .gitignore
git rm --cached package-lock.json
```

## 🎉 推送成功后的下一步

1. **访问GitHub仓库** - 确认代码已上传
2. **设置仓库信息** - 添加README、topics等
3. **配置Netlify** - 连接GitHub进行自动部署
4. **配置Render** - 部署后端服务
5. **测试完整功能** - 验证生产环境

## 📞 获取帮助

如果遇到问题：
1. 检查 `git status` 查看当前状态
2. 使用 `git log` 查看提交历史
3. 查看GitHub官方文档
4. 运行 `npm test` 验证项目状态

---

**🎉 完成这些步骤后，你的代码就安全地托管在GitHub上了！**