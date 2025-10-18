#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  
  const color = colors[type] || colors.info;
  console.log(`${color}${message}${colors.reset}`);
}

async function main() {
  log('🚀 情侣同步观影应用 - 部署设置工具\n', 'info');
  
  try {
    // 检查Node.js版本
    log('📋 检查环境...', 'info');
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      log(`❌ Node.js版本过低: ${nodeVersion}`, 'error');
      log('请升级到Node.js 16或更高版本', 'warning');
      process.exit(1);
    }
    log(`✅ Node.js版本: ${nodeVersion}`, 'success');
    
    // 检查必需文件
    log('\n📁 检查项目文件...', 'info');
    const requiredFiles = [
      'public/index.html',
      'server.js',
      'websocket-handler.js',
      'netlify/functions/api.js',
      'package.json',
      'netlify.toml'
    ];
    
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    if (missingFiles.length > 0) {
      log(`❌ 缺少文件: ${missingFiles.join(', ')}`, 'error');
      process.exit(1);
    }
    log('✅ 所有必需文件都存在', 'success');
    
    // 安装依赖
    log('\n📦 安装依赖...', 'info');
    try {
      execSync('npm install', { stdio: 'inherit' });
      log('✅ 依赖安装完成', 'success');
    } catch (error) {
      log('❌ 依赖安装失败', 'error');
      process.exit(1);
    }
    
    // 配置WebSocket URL
    log('\n🌐 配置WebSocket连接...', 'info');
    const useDefault = await question('使用默认WebSocket配置吗? (Y/n): ');
    
    if (useDefault.toLowerCase() === 'n' || useDefault.toLowerCase() === 'no') {
      const wsUrl = await question('请输入WebSocket服务器URL (例如: wss://your-server.com/ws): ');
      
      // 更新前端配置
      const htmlPath = 'public/index.html';
      let html = fs.readFileSync(htmlPath, 'utf8');
      
      html = html.replace(
        /return 'wss:\/\/your-websocket-server\.onrender\.com\/ws';/,
        `return '${wsUrl}';`
      );
      
      fs.writeFileSync(htmlPath, html);
      log(`✅ WebSocket URL已更新为: ${wsUrl}`, 'success');
    } else {
      log('✅ 使用默认WebSocket配置', 'success');
    }
    
    // 测试构建
    log('\n🔨 测试构建...', 'info');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      log('✅ 构建成功', 'success');
    } catch (error) {
      log('⚠️  构建测试失败，但可能不影响部署', 'warning');
    }
    
    // 创建GitHub仓库说明
    log('\n📚 GitHub仓库设置...', 'info');
    log('1. 在GitHub上创建新仓库', 'info');
    log('2. 运行以下命令推送代码:', 'info');
    log('   git init', 'info');
    log('   git add .', 'info');
    log('   git commit -m "Initial commit"', 'info');
    log('   git branch -M main', 'info');
    log('   git remote add origin <your-repo-url>', 'info');
    log('   git push -u origin main', 'info');
    
    // 部署说明
    log('\n🚀 部署步骤:', 'info');
    log('1. 前端部署到Netlify:', 'info');
    log('   - 访问 netlify.com', 'info');
    log('   - 连接GitHub仓库', 'info');
    log('   - 自动部署设置', 'info');
    
    log('\n2. 后端部署到Render:', 'info');
    log('   - 访问 render.com', 'info');
    log('   - 创建Web Service', 'info');
    log('   - 连接GitHub仓库', 'info');
    log('   - 设置环境变量', 'info');
    
    // 完成
    log('\n🎉 设置完成！', 'success');
    log('请按照上述步骤完成部署', 'info');
    log('详细说明请参考 README.md 和 DEPLOYMENT.md', 'info');
    
  } catch (error) {
    log(`\n❌ 设置过程中出现错误: ${error.message}`, 'error');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 运行主函数
main().catch(error => {
  log(`\n❌ 未预期的错误: ${error.message}`, 'error');
  process.exit(1);
});