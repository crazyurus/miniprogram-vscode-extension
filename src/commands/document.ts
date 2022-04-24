import * as vscode from 'vscode';
import * as http from 'http';
import * as https from 'https';
import { openURL } from '../utils/ui';

function activate(): void {
  vscode.commands.registerCommand('MiniProgram.commands.document', () => {
    const server = http.createServer((request, response) => {
      https.get('https://developers.weixin.qq.com' + request.url, result => {
        let body = '';

        result.on('data', chunk => body += chunk);
        result.on('end', () => {
          response.writeHead(result.statusCode || 200, {});
          body = body.replace('<body>', '<body style="background-color: #fff">')
          response.end(body);
        });
      });
    });
    server.listen();

    server.on('listening', async () => {
      const address = server.address() as { port: number };

      if (address) {
        const webview = await openURL(`http://localhost:${address.port}/miniprogram/dev/framework/`, '微信官方文档');

        webview.onDidDispose(() => {
          server.close();
        });
      }
    });
  });

  vscode.commands.registerCommand('MiniProgram.commands.management', () => {
    vscode.env.openExternal(vscode.Uri.parse('https://mp.weixin.qq.com/'));
  });
}

function deactivate(): void { }

export {
  activate,
  deactivate,
};
