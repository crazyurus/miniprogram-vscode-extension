import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { getCurrentFolderPath } from '../utils/path';
import Plugin from '../base';

class TypeScriptPlugin extends Plugin {
  activate(): void {
    const rootPath = getCurrentFolderPath();
    const typeFilePath = path.join(rootPath, 'node_modules', '@types', 'wechat-miniprogram');
    const library = '@types/wechat-miniprogram';

    if (fs.existsSync(typeFilePath)) {
      return;
    }

    vscode.tasks.executeTask(new vscode.Task({
      type: 'miniprogram.tasks.install-types',
    }, '下载小程序 API 描述文件', 'npm', new vscode.ShellExecution('npm', ['install', '--no-save', library, '--registry=https://registry.npmmirror.com'], {
      cwd: rootPath,
    })));
  }
}

export default new TypeScriptPlugin();
