import * as vscode from 'vscode';
import Command from '../base';

class ManagementCommand extends Command {
  activate(): void {
    this.register('MiniProgram.commands.management', () => {
      vscode.env.openExternal(vscode.Uri.parse('https://mp.weixin.qq.com/'));
    });
  }
} 

export default new ManagementCommand();
