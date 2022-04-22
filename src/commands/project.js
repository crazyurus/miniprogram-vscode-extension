const vscode = require('vscode');
const path = require('path');
const open = require('open');
const { getCurrentFolderPath, getIDEPath } = require('../utils/path');
const { readProjectConfig, createProject } = require('../utils/project');
const { openWebView, openDocument } = require('../utils/ui');
const projectHTML = require('../html/project');

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

function setCommands(context) {
  // 打开 IDE
  vscode.commands.registerCommand('MiniProgram.commands.config.openIDE', async () => {
    const idePath = await getIDEPath();

    if (idePath) {
      // 先启动 IDE 加快速度
      open.openApp(idePath.exe);

      // 再调用 CLI
      const rootPath = getCurrentFolderPath();
      const terminal = vscode.window.createTerminal('打开微信开发者工具');

      terminal.sendText(idePath.cli + ' open --project ' + rootPath);
      terminal.show();
    } else {
      vscode.window.showWarningMessage('未找到微信开发者工具 IDE');
    }
  });

  // 项目详情
  vscode.commands.registerCommand('MiniProgram.commands.config.project', async () => {
    const projectConfig = readProjectConfig();

    if (projectConfig) {
      const ci = require('miniprogram-ci');
      const options = await createProject(context);
      const project = new ci.Project(options);
      const projectSetting = await project.attr();
      const panel = openWebView(projectHTML({
        name: projectSetting.appName,
        avatar: projectSetting.appImageUrl + '/0',
        form: [
          {
            label: '发布状态',
            value: projectSetting.released ? '已发布' : '未发布',
          },
          {
            label: 'AppID',
            value: projectSetting.appid,
          },
          {
            label: '项目名称',
            value: projectConfig.projectname,
          },
          {
            label: '基础库版本',
            value: projectConfig.libVersion,
          },
          {
            label: '本地目录',
            value: options.projectPath,
            link: true,
          },
          {
            label: '代码包总大小（使用分包）',
            value: projectSetting.setting.MaxSubpackageFullCodeSize + ' MB',
          },
          {
            label: '代码包总大小（未使用分包）',
            value: projectSetting.setting.MaxSubpackageSubCodeSize + ' MB',
          },
          {
            label: 'Tabbar 最小个数',
            value: projectSetting.setting.MinTabbarCount,
          },
          {
            label: 'Tabbar 最大个数',
            value: projectSetting.setting.MaxTabbarCount,
          },
          {
            label: 'Tabbar 的 Icon 大小限制',
            value: projectSetting.setting.MaxTabbarIconSize + ' KB',
          },
        ]
      }), '项目配置', vscode.ViewColumn.Beside);

      panel.webview.onDidReceiveMessage(message => {
        switch (message.command) {
          case 'openProject':
            open(options.projectPath);
            break;
          case 'openConfig':
            const projectFilePath = path.join(options.projectPath, 'project.config.json')
            openDocument(projectFilePath);
            break;
        }
      }, undefined, context.subscriptions);
    } else {
      vscode.window.showWarningMessage('未找到 project.config.json 文件');
    }
  });
}

function activate(context) {
  setStatusBar();
  setCommands(context);
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};
