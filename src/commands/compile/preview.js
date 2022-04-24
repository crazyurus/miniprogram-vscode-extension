const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { readProjectConfig, readAppConfig, createProject } = require('../../utils/project');
const { openWebView } = require('../../utils/ui');
const renderHTML = require('../../html/render');
const { getCIBot, getCompileOptions, getTemporaryFileName, registerCommand } = require('./utils');

function preview(context) {
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
      const ci = require('miniprogram-ci');
      const project = new ci.Project(options);
      const { appName } = await project.attr();

      await ci.preview({
        project,
        desc: '来自 VSCode MiniProgram Extension',
        setting: getCompileOptions(projectConfig.setting),
        qrcodeFormat: 'base64',
        qrcodeOutputDest: tempImagePath,
        pagePath,
        onProgressUpdate(message) {
          progress.report(message);
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

module.exports = preview;
