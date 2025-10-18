const http = require('http');
const fs = require('fs');
const path = require('path');

// 测试配置
const tests = [
  {
    name: '前端文件存在检查',
    test: () => {
      const files = [
        'public/index.html',
        'server.js',
        'websocket-handler.js',
        'netlify/functions/api.js',
        'package.json',
        'netlify.toml'
      ];
      
      const missing = files.filter(file => !fs.existsSync(file));
      if (missing.length > 0) {
        throw new Error(`缺少文件: ${missing.join(', ')}`);
      }
      return '所有必需文件都存在';
    }
  },
  {
    name: 'package.json配置检查',
    test: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const required = ['name', 'version', 'scripts', 'dependencies'];
      const missing = required.filter(key => !pkg[key]);
      if (missing.length > 0) {
        throw new Error(`package.json缺少: ${missing.join(', ')}`);
      }
      return 'package.json配置正确';
    }
  },
  {
    name: 'Netlify配置检查',
    test: () => {
      const config = fs.readFileSync('netlify.toml', 'utf8');
      if (!config.includes('[build]')) {
        throw new Error('netlify.toml缺少[build]配置');
      }
      if (!config.includes('publish = "public"')) {
        throw new Error('netlify.toml发布目录配置错误');
      }
      return 'Netlify配置正确';
    }
  },
  {
    name: '前端WebSocket配置检查',
    test: () => {
      const html = fs.readFileSync('public/index.html', 'utf8');
      if (!html.includes('getWebSocketUrl()')) {
        throw new Error('前端缺少getWebSocketUrl函数');
      }
      if (!html.includes('WebSocket')) {
        throw new Error('前端缺少WebSocket代码');
      }
      return '前端WebSocket配置正确';
    }
  },
  {
    name: '后端服务器检查',
    test: async () => {
      return new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 3000,
          path: '/api/rooms',
          method: 'GET',
          timeout: 5000
        }, (res) => {
          if (res.statusCode === 200) {
            resolve('后端服务器响应正常');
          } else {
            reject(new Error(`服务器返回状态码: ${res.statusCode}`));
          }
        });
        
        req.on('error', (err) => {
          reject(new Error(`服务器连接失败: ${err.message}`));
        });
        
        req.on('timeout', () => {
          reject(new Error('服务器连接超时'));
        });
        
        req.end();
      });
    }
  }
];

// 运行测试
async function runTests() {
  console.log('🚀 开始部署配置测试...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      process.stdout.write(`  ${test.name}... `);
      const result = await test.test();
      console.log(`✅ ${result}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 测试结果:`);
  console.log(`  ✅ 通过: ${passed}`);
  console.log(`  ❌ 失败: ${failed}`);
  
  if (failed === 0) {
    console.log(`\n🎉 所有测试通过！部署配置正确。`);
    console.log(`\n📋 下一步操作:`);
    console.log(`  1. 将代码推送到GitHub仓库`);
    console.log(`  2. 连接GitHub到Netlify进行自动部署`);
    console.log(`  3. 部署后端到Render平台`);
    console.log(`  4. 更新前端WebSocket URL配置`);
    console.log(`  5. 测试完整功能`);
  } else {
    console.log(`\n⚠️  发现 ${failed} 个问题需要修复。`);
    console.log(`请根据错误信息修复问题后重新测试。`);
  }
}

// 运行测试
runTests().catch(console.error);