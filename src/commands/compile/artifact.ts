import os from 'node:os';
import path from 'node:path';
import * as ci from 'miniprogram-ci';
import open from 'open';
import * as vscode from 'vscode';

import { createProject } from '../../utils/project';
import Command from '../base';
import { getTemporaryFileName } from './utils';

class ArtifactCommand extends Command {
  activate(context: vscode.ExtensionContext): void {
    this.register('MiniProgram.commands.compile.artifact', async () => {
      const options = await createProject(context);
      const artifactZipPath = path.join(os.tmpdir(), getTemporaryFileName('artifact', options.appid, 'zip'));
      await vscode.window.withProgress(
        {
          title: '正在编译小程序',
          location: vscode.ProgressLocation.Notification,
          cancellable: true
        },
        async progress => {
          const project = new ci.Project(options);

          await ci.getCompiledResult(
            {
              project,
              version: '1.0.0',
              setting: {
                useProjectConfig: true
              },
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
