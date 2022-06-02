import * as vscode from 'vscode';
import Command from './base';

class StorageCommand extends Command {
  activate(context: vscode.ExtensionContext): void {
    this.register('MiniProgram.commands.storage.clear', () => {
      context.workspaceState.update('privateKey', '');
      context.workspaceState.update('privateKeyPath', '');
      context.workspaceState.update('previousVersion', '');
      vscode.window.showInformationMessage('清除成功');
    });
  }
}

export default new StorageCommand();
