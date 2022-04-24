const vscode = require('vscode');
const fs = require('fs');
const { updateJSON } = require('../../utils/json');
const { getCurrentFolderPath, getProjectConfigPath } = require('../../utils/path');

function compileDirectory() {
  vscode.commands.registerCommand('MiniProgram.commands.config.compileDir', e => {
    const rootPath = getCurrentFolderPath();
    const projectFilePath = getProjectConfigPath(rootPath);

    if (fs.existsSync(projectFilePath)) {
      updateJSON(projectFilePath, 'miniprogramRoot', e.fsPath);
      vscode.window.showInformationMessage('设置成功，当预览或上传小程序时，将仅打包此目录下的文件');
    } else {
      vscode.window.showErrorMessage('未找到 project.config.json 文件');
    }
  });
}

module.exports = compileDirectory;
