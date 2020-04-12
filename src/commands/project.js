const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { readProjectConfig } = require('../utils/project');
const { getCurrentFolderPath } = require('../utils/path');

function setStatusBar() {
  const projectConfig = readProjectConfig();

  if (projectConfig) {
    const item = vscode.window.createStatusBarItem(1, 24);

    item.text = `$(bookmark) ${projectConfig.projectname} (${projectConfig.appid})`;
    item.tooltip = '查看项目的详细配置';
    item.command = 'MiniProgram.commands.config.project';
    item.show();
  }
}

function setCommands() {
  vscode.commands.registerCommand('MiniProgram.commands.config.project', () => {
    const rootPath = getCurrentFolderPath();
    const projectFilePath = rootPath + path.sep + 'project.config.json';

    if (fs.existsSync(projectFilePath)) {
      vscode.workspace.openTextDocument(projectFilePath)
        .then(document => vscode.window.showTextDocument(document));
    } else {
      vscode.window.showErrorMessage('未找到 project.config.json 文件');
    }
  });
}

function activate(context) {
  setStatusBar();
  setCommands();
}

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
