import * as vscode from 'vscode';
import * as http from 'http';
import { fetch } from 'undici';
import { openURL } from '../utils/ui';

function createServer(url: string, title: string): void {
  const baseURL = 'https://developers.weixin.qq.com';
  const server = http.createServer(async (request, response) => {
    const result = await fetch(baseURL + request.url);
    let content = await result.text();

    response.writeHead(result.status || 200, {});
    content = content.replace('<body>', '<body style="background-color: #fff">')
    response.end(content);
  });
  server.listen();

  server.on('listening', async () => {
    const address = server.address() as { port: number };

    if (address) {
      const webviewURL = url.replace(baseURL, `http://localhost:${address.port}`);
      const webview = await openURL(webviewURL, title);

      webview.onDidDispose(() => {
        server.close();
      });
    }
  });
}

function activate(): void {
  vscode.commands.registerCommand('MiniProgram.commands.document.open', () => {
    createServer('https://developers.weixin.qq.com/miniprogram/dev/framework/', '微信开发文档');
  });

  vscode.commands.registerCommand('MiniProgram.commands.document.search', () => {
    // TODO
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
