const vscode = require('vscode');
const fs = require('fs');
const os = require('os');
const open = require('open');
const { getProjectConfigPath } = require('../utils/path');
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
  vscode.commands.registerCommand('MiniProgram.commands.config.openIDE', () => {
    const platform = os.platform();
    const installPath = {
      win32: 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\微信开发者工具.exe',
      darwin: '/Applications/wechatwebdevtools.app',
    };

    if (installPath.hasOwnProperty(platform) && fs.existsSync(installPath[platform])) {
      const idePath = installPath[platform];

      if (platform === 'win32') {
        open(idePath);
      } else {
        open.openApp(idePath);
      }
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
            const projectFilePath = getProjectConfigPath(options.projectPath);
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
