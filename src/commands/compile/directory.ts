import fs from 'node:fs';
import path from 'node:path';
import * as vscode from 'vscode';

import { updateJSON } from '../../utils/json';
import { getCurrentFolderPath, getProjectConfigPath } from '../../utils/path';
import Command from '../base';

class CompileDirectoryCommand extends Command {
  activate(): void {
    this.register('MiniProgram.commands.config.compileDir', async (e: vscode.Uri) => {
      const rootPath = getCurrentFolderPath();
      const projectFilePath = getProjectConfigPath(rootPath);

      if (!fs.existsSync(projectFilePath)) {
        throw new Error('未找到 project.config.json 文件');
      }

      await updateJSON(projectFilePath, 'miniprogramRoot', path.relative(rootPath, e.fsPath));
      vscode.window.showInformationMessage('设置成功，当预览或上传小程序时，将仅打包此目录下的文件');
    });
  }
}

export default new CompileDirectoryCommand();
