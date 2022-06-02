import * as vscode from 'vscode';
import Module from '../base';
import { saveMiniprogramProject } from './compile/utils';

class Command extends Module {
  register(command: string, callback: (e: any) => void): void {
    vscode.commands.registerCommand(command, async e => {
      try {
        await callback(e);
      } catch (error: any) {
        if (error.message === '未找到 project.config.json 文件') {
          const result = await vscode.window.showErrorMessage('未找到 project.config.json 文件，请手动选择', '选择文件');
          if (result === '选择文件') {
            saveMiniprogramProject();
          }
        } else {
          vscode.window.showErrorMessage(error.message);
        }
      }
    });
  }
}

export default Command;
