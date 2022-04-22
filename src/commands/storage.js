const vscode = require('vscode');

function activate(context) {
  vscode.commands.registerCommand('MiniProgram.commands.storage.clear', e => {
    context.workspaceState.update('privateKeyPath', '');
    context.workspaceState.update('previousVersion', '');
    vscode.window.showInformationMessage('清除成功');
  });
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};