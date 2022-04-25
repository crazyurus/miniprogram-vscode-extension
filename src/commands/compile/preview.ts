import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { readProjectConfig, readAppConfig, createProject } from '../../utils/project';
import { openWebView } from '../../utils/ui';
import renderHTML from '../../utils/render';
import { getCIBot, getCompileOptions, getTemporaryFileName, registerCommand } from './utils';
import type { ProjectAttributes } from '../../types';

function preview(context: vscode.ExtensionContext): void {
  registerCommand('MiniProgram.commands.compile.preview', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      throw new Error('未找到 project.config.json 文件');
    }

    const options = await createProject(context);
    const tempImagePath = path.join(os.tmpdir(), getTemporaryFileName('qrcode', options.appid, 'jpg'));
    const appConfig = readAppConfig(options.projectPath);

    if (!appConfig) {
      throw new Error('未找到 app.json 文件');
    }

    const { pages } = appConfig;
    const pagePath = await vscode.window.showQuickPick(pages, {
      placeHolder: '选择需要预览的页面，默认为小程序首页',
    });

    if (!pagePath) {
      return;
    }

    await vscode.window.withProgress({
      title: '正在编译小程序',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async progress => {
      const ci = await import('miniprogram-ci');
      const project = new ci.Project(options);
      const { appName } = await project.attr() as ProjectAttributes;

      await ci.preview({
        project,
        version: '',
        desc: '来自 VSCode MiniProgram Extension',
        setting: getCompileOptions(projectConfig.setting),
        qrcodeFormat: 'base64',
        qrcodeOutputDest: tempImagePath,
        pagePath,
        onProgressUpdate(message): void {
          progress.report(typeof message === 'string' ? { message } : message);
        },
        robot: getCIBot(),
      });

      const base64 = await fs.promises.readFile(tempImagePath, 'utf-8');

      vscode.window.showInformationMessage('构建完成');
      openWebView(await renderHTML('preview', {
        base64,
        appName,
      }), '预览小程序');
    });
  });
}

export default preview;
