import * as vscode from 'vscode';
import { createServer } from './utils';

function activate(context: vscode.ExtensionContext): void {
  vscode.commands.registerCommand('MiniProgram.commands.document.open', () => {
    createServer('https://developers.weixin.qq.com/miniprogram/dev/framework/', '微信开发文档');
  });
}

export default activate;
