const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { readProjectConfig, readAppConfig, createProject } = require('../../utils/project');
const { openWebView } = require('../../utils/ui');
const previewHTML = require('../../html/preview');
const { getCIBot, getCompileOptions } = require('./utils');

function preview(context) {
  vscode.commands.registerCommand('MiniProgram.commands.compile.preview', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      vscode.window.showWarningMessage('未找到 project.config.json 文件');
      return;
    }

    const options = await createProject(context);
    const timestamp = Date.now();
    const tempImagePath = path.join(os.tmpdir(), options.appid + timestamp + '-qrcode.jpg');
    const { pages } = readAppConfig(options.projectPath);
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
      }).then(() => {
        if (!fs.existsSync(tempImagePath)) {
          vscode.window.showErrorMessage('构建失败');
          return;
        }

        const base64 = fs.readFileSync(tempImagePath, 'utf-8');

        vscode.window.showInformationMessage('构建完成');
        openWebView(previewHTML({
          base64,
          appName,
        }), '预览小程序');
      }).catch(error => {
        vscode.window.showErrorMessage(error.message);
      });
    });
  });
}

module.exports = preview;
