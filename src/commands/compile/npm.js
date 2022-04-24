const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { readProjectConfig, createProject } = require('../../utils/project');

function packNPM(context) {
  vscode.commands.registerCommand('MiniProgram.commands.compile.npm', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      vscode.window.showWarningMessage('未找到 project.config.json 文件');
      return;
    }

    const options = await createProject(context);

    if (!fs.existsSync(path.join(options.projectPath, 'package.json'))) {
      vscode.window.showWarningMessage('未找到 package.json 文件');
      return;
    }

    await vscode.window.withProgress({
      title: '正在构建 NPM',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async () => {
      const ci = require('miniprogram-ci');
      const project = new ci.Project(options);
      const warning = await ci.packNpm(project, {
        reporter(info) {
          vscode.window.showInformationMessage(`构建完成，共用时 ${info.pack_time} ms，其中包含小程序依赖 ${info.miniprogram_pack_num} 项、其它依赖 ${info.other_pack_num} 项`);
        },
      }).catch(error => {
        vscode.window.showErrorMessage(error.message);
      });

      if (warning.length > 0) {
        vscode.window.showWarningMessage(warning.map((item, index) => {
          return `${index + 1}. ${path.relative(options.projectPath, item.jsPath)}: ${item.msg}`
        }).join('\n'));
      }
    });
  });
}

module.exports = packNPM;
