import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import open from 'open';
import { readProjectConfig, createProject } from '../../utils/project';
import { getCompileOptions, getTemporaryFileName, registerCommand } from './utils';

function artifact(context: vscode.ExtensionContext): void {
  registerCommand('MiniProgram.commands.compile.artifact', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      throw new Error('未找到 project.config.json 文件');
    }

    const options = await createProject(context);
    const artifactZipPath = path.join(os.tmpdir(), getTemporaryFileName('artifact', options.appid, 'zip'));
    await vscode.window.withProgress({
      title: '正在编译小程序',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async progress => {
      const ci = await import('miniprogram-ci');
      const project = new ci.Project(options);

      await ci.getCompiledResult({
        project,
        version: '1.0.0',
        setting: getCompileOptions(projectConfig.setting),
        onProgressUpdate(message): void {
          progress.report(typeof message === 'string' ? { message } : message);
        },
      }, artifactZipPath);

      open(artifactZipPath);
    });
  });
}

export default artifact;
