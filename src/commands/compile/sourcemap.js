const vscode = require('vscode');
const open = require('open');
const { readProjectConfig, createProject } = require('../../utils/project');
const { showSaveDialog } = require('../../utils/ui');
const { getCIBot, getTemporaryFileName } = require('./utils');

function sourceMap(context) {
  vscode.commands.registerCommand('MiniProgram.commands.compile.sourceMap', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      vscode.window.showWarningMessage('未找到 project.config.json 文件');
      return;
    }

    const sourceMapSavePath = await showSaveDialog({
      defaultUri: vscode.Uri.file(getTemporaryFileName('sourcemap', projectConfig.appid, 'zip')),
    });

    if (!sourceMapSavePath) {
      return;
    }

    const options = await createProject(context);
    await vscode.window.withProgress({
      title: '正在获取最近上传版本的 SourceMap',
      location: vscode.ProgressLocation.Window,
      cancellable: true,
    }, async () => {
      const ci = require('miniprogram-ci');
      const project = new ci.Project(options);
      await ci.getDevSourceMap({
        project,
        robot: getCIBot(),
        sourceMapSavePath,
      }).catch(error => {
        vscode.window.showErrorMessage(error.message);
      });

      const result = await vscode.window.showInformationMessage('最近上传版本的 SourceMap 保存成功', '查看 SourceMap');

      if (result === '查看 SourceMap') {
        open(sourceMapSavePath);
      }
    });
  });
}

module.exports = sourceMap;
