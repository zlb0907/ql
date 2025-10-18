const { app, server, wss } = require('../../server.js');
const serverless = require('serverless-http');

// 导出Netlify函数
exports.handler = serverless(app);