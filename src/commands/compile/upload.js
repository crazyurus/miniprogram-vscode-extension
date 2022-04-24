const vscode = require('vscode');
const { readProjectConfig, createProject } = require('../../utils/project');
const { showInputBox } = require('../../utils/ui');
const { getCIBot, getCompileOptions } = require('./utils');

function upload(context) {
  vscode.commands.registerCommand('MiniProgram.commands.compile.upload', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      vscode.window.showWarningMessage('未找到 project.config.json 文件');
      return;
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
      const ci = require('miniprogram-ci');
      const project = new ci.Project(options);

      await ci.upload({
        project,
        version,
        desc: description || '通过%20MiniProgram%20VSCode%20Extension%20上传',
        setting: getCompileOptions(projectConfig.setting),
        onProgressUpdate(message) {
          progress.report(message);
        },
        robot: getCIBot(),
      }).then(() => {
        vscode.window.showInformationMessage('上传成功，可前往微信小程序后台提交审核并发布', '打开微信小程序后台').then(result => {
          switch (result) {
            case '打开微信小程序后台':
              vscode.env.openExternal('https://mp.weixin.qq.com/');
              break;
          }
        });

        context.workspaceState.update('previousVersion', version);
      }).catch(error => {
        vscode.window.showErrorMessage(error.message);
      });
    });
  });
}

module.exports = upload;
