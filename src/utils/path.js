const vscode = require('vscode');

function getCurrentFolderPath() {
  return vscode.workspace.workspaceFolders[0].uri.fsPath;
}

exports.getCurrentFolderPath = getCurrentFolderPath;
