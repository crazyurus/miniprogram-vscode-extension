import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import open from 'open';
import { getProjectConfigPath } from '../utils/path';
import { readProjectConfig, createProject } from '../utils/project';
import { openWebView, openDocument } from '../utils/ui';
import renderHTML from '../utils/render';
import { registerCommand } from './compile/utils';
import type { WebviewMessage, ProjectAttributes } from '../types';

function setStatusBar(): void {
  const projectConfig = readProjectConfig();

  if (projectConfig) {
    const item = vscode.window.createStatusBarItem(1, 24);

    item.text = `$(bookmark) ${projectConfig.projectname} (${projectConfig.appid})`;
    item.tooltip = '查看项目的详细配置';
    item.command = 'MiniProgram.commands.config.project';
    item.show();
  }
}

function setCommands(context: vscode.ExtensionContext): void {
  // 打开 IDE
  registerCommand('MiniProgram.commands.config.openIDE', async () => {
    const installPath = {
      win32: 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\微信开发者工具.exe',
      darwin: '/Applications/wechatwebdevtools.app',
    };
    const platform = os.platform() as keyof typeof installPath;

    if (installPath.hasOwnProperty(platform) && fs.existsSync(installPath[platform])) {
      const idePath = installPath[platform];

      if (platform === 'win32') {
        const { execFile } = await import('child_process');

        execFile(idePath);
      } else {
        open.openApp(idePath);
      }
    } else {
      throw new Error('未找到微信开发者工具 IDE');
    }
  });

  // 项目详情
  registerCommand('MiniProgram.commands.config.project', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      throw new Error('未找到 project.config.json 文件');
    }

    const ci = await import('miniprogram-ci');
    const options = await createProject(context);
    const project = new ci.Project(options);
    const projectSetting = await project.attr() as ProjectAttributes;
    const panel = openWebView(await renderHTML('project', {
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

    panel.webview.onDidReceiveMessage((message: WebviewMessage) => {
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
  });
}

function activate(context: vscode.ExtensionContext): void {
  setStatusBar();
  setCommands(context);
}

function deactivate(): void { }

export {
  activate,
  deactivate,
};
