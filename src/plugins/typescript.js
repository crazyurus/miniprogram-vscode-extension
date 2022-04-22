const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { getCurrentFolderPath } = require('../utils/path');

function activate() {
  const rootPath = getCurrentFolderPath();
  const packageJSONPath = path.join(rootPath, 'package.json');

  if (!fs.existsSync(packageJSONPath)) {
    return;
  }

  const content = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'));
  const library = '@types/wechat-miniprogram';

  if (
    (content.dependencies && content.dependencies.hasOwnProperty(library)) ||
    (content.devDependencies && content.devDependencies.hasOwnProperty(library))
  ) {
    return;
  }

  vscode.window.createTerminal({
    name: '下载小程序 API 类型文件',
    hideFromUser: true,
  }).sendText('npm install -D ' + library);
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};