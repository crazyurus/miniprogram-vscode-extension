import * as vscode from 'vscode';

function activate(context: vscode.ExtensionContext): void {
  vscode.commands.registerCommand('MiniProgram.commands.storage.clear', () => {
    context.workspaceState.update('privateKey', '');
    context.workspaceState.update('privateKeyPath', '');
    context.workspaceState.update('previousVersion', '');
    vscode.window.showInformationMessage('清除成功');
  });
}

function deactivate(): void { }

export {
  activate,
  deactivate,
};
