import * as vscode from 'vscode';

import Command from './base';

class StorageCommand extends Command {
  activate(context: vscode.ExtensionContext): void {
    this.register('MiniProgram.commands.storage.clear', async () => {
      const action = await vscode.window.showInformationMessage(
        '确定要清除缓存吗？清除后代码上传密钥需要重新添加',
        {
          modal: true
        },
        '确定'
      );

      if (action === '确定') {
        context.workspaceState.update('privateKey', '');
        context.workspaceState.update('previousVersion', '');

        vscode.window.showInformationMessage('清除成功');
      }
    });
  }
}

export default new StorageCommand();
