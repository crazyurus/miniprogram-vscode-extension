import * as vscode from 'vscode';
import { readProjectConfig, createProject } from '../../utils/project';
import { showInputBox } from '../../utils/ui';
import { getCIBot, getCompileOptions, registerCommand } from './utils';

function upload(context: vscode.ExtensionContext): void {
  registerCommand('MiniProgram.commands.compile.upload', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      throw new Error('未找到 project.config.json 文件');
    }

    const options = await createProject(context);
    const previousVersion = context.workspaceState.get('previousVersion');
    const version = await showInputBox({
      title: '上传小程序',
      prompt: '版本号',
      placeholder: '请输入小程序版本号，' + (previousVersion ? '当前版本：' + previousVersion : '如：1.2.3'),
      step: 1,
      totalSteps: 2,
    });

    if (!version) {
      return;
    }

    const description = await showInputBox({
      title: '上传小程序',
      prompt: '项目备注',
      placeholder: '请输入项目备注（选填）',
      step: 2,
      totalSteps: 2,
    });

    await vscode.window.withProgress({
      title: '正在上传小程序',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async progress => {
      const ci = await import('miniprogram-ci');
      const project = new ci.Project(options);

      await ci.upload({
        project,
        version,
        desc: description || '通过%20MiniProgram%20VSCode%20Extension%20上传',
        setting: getCompileOptions(projectConfig.setting),
        onProgressUpdate(message): void {
          progress.report(typeof message === 'string' ? { message } : message);
        },
        robot: getCIBot(),
      });

      vscode.window.showInformationMessage('上传成功，可前往微信小程序后台提交审核并发布', '打开微信小程序后台').then(result => {
        if (result === '打开微信小程序后台') {
          vscode.env.openExternal(vscode.Uri.parse('https://mp.weixin.qq.com/'));
        }
      });

      await context.workspaceState.update('previousVersion', version);
    });
  });
}

export default upload;
