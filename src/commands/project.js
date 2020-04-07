const vscode = require('vscode');
const { readProjectConfig } = require('../utils/project');

function setStatusBar() {
  const projectConfig = readProjectConfig();

  if (projectConfig) {
    const item = vscode.window.createStatusBarItem(1, 24);

    item.text = `${projectConfig.projectname} (${projectConfig.appid})`;
    item.tooltip = '查看项目的详细配置';
    item.command = 'MiniProgram.commands.config.project';
    item.show();
  }
}

function setCommands() {
  vscode.commands.registerCommand('MiniProgram.commands.config.project', () => {
    vscode.window.showInformationMessage('查看项目配置开发中');
  });
}

function activate(context) {
  setStatusBar();
  setCommands();
}

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
