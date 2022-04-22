const vscode = require('vscode');
const http = require('http');
const https = require('https');
const { openWebView } = require('../utils/ui');

function activate() {
  vscode.commands.registerCommand('MiniProgram.commands.document', () => {
    const server = http.createServer((request, response) => {
      https.get('https://developers.weixin.qq.com' + request.url, result => {
        let body = '';

        result.on('data', chunk => body += chunk);
        result.on('end', () => {
          response.writeHead(result.statusCode, {});
          body = body.replace('<body>', '<body style="background-color: #fff">')
          response.end(body);
        });
      });
    });
    server.listen();

    server.on('listening', () => {
      const address = server.address();

      if (address) {
        const webview = openWebView(`http://localhost:${address.port}/miniprogram/dev/framework/`, '微信官方文档');

        webview.onDidDispose(() => {
          server.close();
        });
      }
    });
  });

  vscode.commands.registerCommand('MiniProgram.commands.management', () => {
    vscode.env.openExternal('https://mp.weixin.qq.com/');
  });
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};
