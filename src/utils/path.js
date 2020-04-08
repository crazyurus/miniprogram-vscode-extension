const vscode = require('vscode');

function getCurrentFolderPath() {
  return Array.isArray(vscode.workspace.workspaceFolders) 
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '';
}

exports.getCurrentFolderPath = getCurrentFolderPath;
