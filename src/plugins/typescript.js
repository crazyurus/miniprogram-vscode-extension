const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { readJSON } = require('../utils/json');
const { getCurrentFolderPath } = require('../utils/path');

function activate() {
  const rootPath = getCurrentFolderPath();
  const packageJSONPath = path.join(rootPath, 'package.json');

  if (!fs.existsSync(packageJSONPath)) {
    return;
  }

  const content = readJSON(packageJSONPath);
  const library = '@types/wechat-miniprogram';

  if (
    (content.dependencies && content.dependencies.hasOwnProperty(library)) ||
    (content.devDependencies && content.devDependencies.hasOwnProperty(library))
  ) {
    return;
  }

  vscode.tasks.executeTask(new vscode.Task({
    type: 'miniprogram.tasks.install-types',
  }, vscode.ConfigurationTarget.WorkspaceFolder, '下载小程序 API 描述文件', 'npm', new vscode.ShellExecution('npm', ['install', '-D', library, '--registry=https://registry.npmmirror.com'], {
    cwd: rootPath,
  })));
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};