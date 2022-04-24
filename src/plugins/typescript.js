const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { getCurrentFolderPath } = require('../utils/path');

function activate() {
  const rootPath = getCurrentFolderPath();
  const typeFilePath = path.join(rootPath, 'node_modules', '@types', 'wechat-miniprogram');
  const library = '@types/wechat-miniprogram';

  if (fs.existsSync(typeFilePath)) {
    return;
  }

  vscode.tasks.executeTask(new vscode.Task({
    type: 'miniprogram.tasks.install-types',
  }, vscode.ConfigurationTarget.WorkspaceFolder, '下载小程序 API 描述文件', 'npm', new vscode.ShellExecution('npm', ['install', '--no-save', library, '--registry=https://registry.npmmirror.com'], {
    cwd: rootPath,
  })));
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};