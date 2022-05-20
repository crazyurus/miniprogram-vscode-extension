import * as vscode from 'vscode';
import open from 'open';
import { readProjectConfig, createProject } from '../../utils/project';
import { showSaveDialog } from '../../utils/ui';
import { getCIBot, getTemporaryFileName, registerCommand } from './utils';

function sourceMap(context: vscode.ExtensionContext): void {
  registerCommand('MiniProgram.commands.compile.sourceMap', async () => {
    const projectConfig = readProjectConfig();
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
      const ci = await import('miniprogram-ci');
      const project = new ci.Project(options);

      await ci.getDevSourceMap({
        project,
        robot: getCIBot(),
        sourceMapSavePath,
      });

      vscode.window.showInformationMessage('最近上传版本的 SourceMap 保存成功', '查看 SourceMap').then(result => {
        if (result === '查看 SourceMap') {
          open(sourceMapSavePath);
        }
      });
    });
  });
}

export default sourceMap;