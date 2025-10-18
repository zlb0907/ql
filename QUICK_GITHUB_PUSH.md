# 🚀 快速GitHub推送指南

## 📋 步骤1：创建GitHub仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `couple-sync-movie` (或其他你喜欢的名字)
   - Description: `情侣同步观影应用 - 实时视频同步播放和聊天`
   - 选择 Public 或 Private
   - 不要勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

4. 创建后会看到类似这样的页面：
```
https://github.com/YOUR_USERNAME/couple-sync-movie.git
```

## 📋 步骤2：推送到GitHub

在终端中运行以下命令（替换YOUR_USERNAME和REPO_NAME）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送到GitHub
git push -u origin main
```

## 🔧 如果遇到问题

### 认证问题
如果提示需要用户名密码，建议使用GitHub Personal Access Token：
1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. 创建新的token，勾选 `repo` 权限
3. 使用token作为密码

### 分支问题
如果提示分支不存在，运行：
```bash
git branch -M main
git push -u origin main
```

### 网络问题
如果连接失败，检查：
- 网络连接
- GitHub状态：https://www.githubstatus.com/
- 尝试使用SSH方式：
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/REPO_NAME.git
```

## ✅ 推送成功后

1. 访问你的GitHub仓库查看代码
2. 配置Netlify自动部署（参考 DEPLOYMENT_CHECKLIST.md）
3. 配置Render部署后端服务

## 📝 一键脚本（可选）

项目根目录提供了自动化脚本：
- Windows: `PUSH_TO_GITHUB.bat`
- macOS/Linux: `PUSH_TO_GITHUB.sh`

运行前请先手动创建GitHub仓库，然后运行脚本输入仓库URL即可。