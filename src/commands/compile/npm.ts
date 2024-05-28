import fs from 'node:fs';
import path from 'node:path';
import * as vscode from 'vscode';

import { createProject, readProjectConfig } from '../../utils/project';
import Command from '../base';

class NPMCommand extends Command {
  activate(context: vscode.ExtensionContext): void {
    this.register('MiniProgram.commands.compile.npm', async () => {
      readProjectConfig();
      const options = await createProject(context);

      if (!fs.existsSync(path.join(options.projectPath, 'package.json'))) {
        throw new Error('未找到 package.json 文件');
      }

      await vscode.window.withProgress(
        {
          title: '正在构建 NPM',
          location: vscode.ProgressLocation.Notification,
          cancellable: true
        },
        async () => {
          const ci = await import('miniprogram-ci');
          const project = new ci.Project(options);

          const warning = (await ci.packNpm(project, {
            reporter(info: { miniprogram_pack_num: number; pack_time: number; other_pack_num: number }) {
              vscode.window.showInformationMessage(
                `构建完成，共用时 ${info.pack_time} ms，其中包含小程序依赖 ${info.miniprogram_pack_num} 项、其它依赖 ${info.other_pack_num} 项`
              );
            }
          })) as Array<{
            jsPath: string;
            msg: string;
          }>;

          if (warning.length > 0) {
            vscode.window.showWarningMessage(
              warning
                .map((item, index) => {
                  return `${index + 1}. ${path.relative(options.projectPath, item.jsPath)}: ${item.msg}`;
                })
                .join('\n')
            );
          }
        }
      );
    });
  }
}

export default new NPMCommand();
