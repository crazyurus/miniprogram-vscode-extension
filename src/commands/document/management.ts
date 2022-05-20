import * as vscode from 'vscode';

function activate(context: vscode.ExtensionContext): void {
  vscode.commands.registerCommand('MiniProgram.commands.management', () => {
    vscode.env.openExternal(vscode.Uri.parse('https://mp.weixin.qq.com/'));
  });
}

export default activate;
