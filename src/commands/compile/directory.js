const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { updateJSON } = require('../../utils/json');
const { getCurrentFolderPath, getProjectConfigPath } = require('../../utils/path');
const { registerCommand } = require('./utils');

function compileDirectory() {
  registerCommand('MiniProgram.commands.config.compileDir', e => {
    const rootPath = getCurrentFolderPath();
    const projectFilePath = getProjectConfigPath(rootPath);

    if (!fs.existsSync(projectFilePath)) {
      throw new Error('未找到 project.config.json 文件');
    }

    updateJSON(projectFilePath, 'miniprogramRoot', path.relative(rootPath, e.fsPath));
    vscode.window.showInformationMessage('设置成功，当预览或上传小程序时，将仅打包此目录下的文件');
  });
}

module.exports = compileDirectory;
