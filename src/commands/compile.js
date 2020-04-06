const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { updateJSON } = require('../utils/json');

function activate(context) {
  vscode.commands.registerCommand('MiniProgram.commands.config.compileDir', e => {
    const projectFilePath = vscode.workspace.rootPath + path.sep + 'project.config.json';

    if (fs.existsSync(projectFilePath)) {
      updateJSON(projectFilePath, 'miniprogramRoot', e.fsPath);
      vscode.window.showInformationMessage('设置成功，当预览或上传小程序时，将仅打包此目录下的文件');
    } else {
      vscode.window.showErrorMessage('未找到 project.config.json 文件');
    }
  });
}

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
