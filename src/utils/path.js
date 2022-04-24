const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

function getMiniProgramRootPath(rootPath, relativePath) {
  if (relativePath) {
    return path.resolve(rootPath, relativePath);
  }

  return rootPath;
}

function getCurrentFolderPath() {
  const rootPath = Array.isArray(vscode.workspace.workspaceFolders)
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '';
  const config = vscode.workspace.getConfiguration('miniprogram').get('miniprogramPath');

  if (config) {
    const miniprogramPath = path.resolve(rootPath, config);

    if (fs.existsSync(miniprogramPath)) {
      return miniprogramPath;
    }
  }

  return rootPath;
}

function getProjectConfigPath(rootPath) {
  return path.join(rootPath, 'project.config.json')
}

module.exports = {
  getCurrentFolderPath,
  getProjectConfigPath,
  getMiniProgramRootPath,
};
