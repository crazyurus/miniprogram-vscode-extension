import * as vscode from 'vscode';
import * as fs from 'fs';
import open from 'open';
import Command from './base';
import { getCurrentFolderPath, getProjectConfigPath, getIDEPathInfo } from '../utils/path';
import { readProjectConfig, createProject } from '../utils/project';
import { openWebView, openDocument } from '../utils/ui';
import renderHTML from '../utils/render';
import type { WebviewMessage, ProjectAttributes } from '../types';

class ProjectCommand extends Command {
  setStatusBar(): void {
    try {
      const projectConfig = readProjectConfig();
      const item = vscode.window.createStatusBarItem(1, 24);

      item.text = `$(bookmark) ${projectConfig.projectname} (${projectConfig.appid})`;
      item.tooltip = '查看项目的详细配置';
      item.command = 'MiniProgram.commands.config.project';
      item.show();
    } catch {
      
    }
  }

  setCommands(context: vscode.ExtensionContext): void {
    // 打开 IDE
    this.register('MiniProgram.commands.config.openIDE', async () => {
      const { cliPath, statusFile } = getIDEPathInfo();
      const ideStatus = await fs.promises.readFile(statusFile, 'utf-8');
      
      if (ideStatus === 'Off') {
        const result = await vscode.window.showWarningMessage('微信开发者工具的服务端口已关闭，请打开设置 — 安全设置，将服务端口开启', '查看详情');

        if (result === '查看详情') {
          vscode.env.openExternal(vscode.Uri.parse('https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html'));
        }

        return;
      }

      const rootPath = getCurrentFolderPath();
      require('child_process').exec(`"${cliPath}" open --project "${rootPath}"`, (error: Error) => {
        if (error) {
          vscode.window.showErrorMessage(error.message);
        }
      });
    });

    // 项目详情
    this.register('MiniProgram.commands.config.project', async () => {
      const projectConfig = readProjectConfig();
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

  activate(context: vscode.ExtensionContext): void {
    this.setStatusBar();
    this.setCommands(context);
  }
}

export default new ProjectCommand();
