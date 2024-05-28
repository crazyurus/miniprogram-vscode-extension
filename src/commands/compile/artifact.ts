import os from 'node:os';
import path from 'node:path';
import open from 'open';
import * as vscode from 'vscode';

import { createProject, readProjectConfig } from '../../utils/project';
import Command from '../base';
import { getCompileOptions, getTemporaryFileName } from './utils';

class ArtifactCommand extends Command {
  activate(context: vscode.ExtensionContext): void {
    this.register('MiniProgram.commands.compile.artifact', async () => {
      const projectConfig = readProjectConfig();
      const options = await createProject(context);
      const artifactZipPath = path.join(os.tmpdir(), getTemporaryFileName('artifact', options.appid, 'zip'));
      await vscode.window.withProgress(
        {
          title: '正在编译小程序',
          location: vscode.ProgressLocation.Notification,
          cancellable: true
        },
        async progress => {
          const ci = await import('miniprogram-ci');
          const project = new ci.Project(options);

          await ci.getCompiledResult(
            {
              project,
              version: '1.0.0',
              setting: getCompileOptions(projectConfig.setting),
              onProgressUpdate(message): void {
                progress.report(typeof message === 'string' ? { message } : message);
              }
            },
            artifactZipPath
          );

          open(artifactZipPath);
        }
      );
    });
  }
}

export default new ArtifactCommand();
