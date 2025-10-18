@echo off
echo 🚀 开始GitHub仓库推送流程...
echo.

:: 检查Git是否安装
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git未安装，请先安装Git
    pause
    exit /b 1
)

echo 📋 当前Git状态：
git status
echo.

:: 获取用户输入
echo 📝 请输入你的GitHub仓库URL：
echo 格式：https://github.com/USERNAME/REPO_NAME.git
echo 或者：git@github.com:USERNAME/REPO_NAME.git
echo.
set /p repo_url=仓库URL: 

if "%repo_url%"=="" (
    echo ❌ 仓库URL不能为空
    pause
    exit /b 1
)

echo.
echo 🔧 配置远程仓库...
git remote add origin "%repo_url%" 2>nul
if %errorlevel% neq 0 (
    echo 🔄 远程仓库已存在，更新URL...
    git remote set-url origin "%repo_url%"
)

echo.
echo 📂 切换到main分支...
git branch -M main

echo.
echo 🚀 推送到GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 推送成功！
    echo 🎉 你的代码已成功上传到GitHub！
    echo.
    echo 📋 下一步：
    echo 1. 访问你的GitHub仓库查看代码
    echo 2. 配置Netlify进行自动部署
    echo 3. 配置Render部署后端服务
    echo.
    echo 📖 详细说明请参考 DEPLOYMENT_CHECKLIST.md
) else (
    echo.
    echo ❌ 推送失败，请检查：
    echo - 网络连接是否正常
    echo - GitHub仓库URL是否正确
    echo - GitHub账号是否已登录
    echo - 是否有推送权限
    echo.
    echo 🔧 解决方案：
    echo 1. 手动运行：git push -u origin main
    echo 2. 检查GitHub仓库设置
    echo 3. 确认Git配置：git config --list
)

echo.
pause