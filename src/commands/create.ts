import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { updateJSON } from '../utils/json';
import { getAppConfigPath } from '../utils/project';
import { registerCommand } from './compile/utils';

import * as pageTemplate from '../templates/page';
import * as componentTemplate from '../templates/component';

async function create(type: 'page' | 'component', value: string, uri: vscode.Uri): Promise<void> {
  const template: Record<string, string> = type === 'page' ? pageTemplate : componentTemplate;
  const name = type === 'page' ? '页面' : '组件';

  for (let ext in template) {
    const filePath = path.join(uri.fsPath, `${value}.${ext}`);

    if (fs.existsSync(filePath)) {
      throw new Error(name + ' ' + value + ' 已存在');
    }

    await fs.promises.writeFile(filePath, template[ext].trim());
  }

  if (type === 'page') {
    const appConfigFile = getAppConfigPath();
    const projectPath = path.join(appConfigFile, '..');

    if (fs.existsSync(appConfigFile)) {
      const pagePath = path.relative(projectPath, uri.fsPath).replace(path.sep, '/');

      if (pagePath.includes('..')) {
        throw new Error('页面路径不能超过小程序根目录');
      }

      await updateJSON(appConfigFile, 'pages', pagePath + '/' + value, 'push');
    }
  }

  vscode.window.showInformationMessage(name + ' ' + value + ' 创建成功');
}

function validate(name: string): string | null {
  if (/^[a-zA-Z0-9-]+$/.test(name)) return null;
  return '名称只能包含数字、字母、中划线';
}

function activate(): void {
  registerCommand('MiniProgram.commands.create.page', async (e: vscode.Uri) => {
    const uri = vscode.Uri.parse(e.fsPath);
    const value = await vscode.window.showInputBox({
      prompt: '页面名称',
      placeHolder: '请输入页面名称，如：index',
      validateInput: validate,
    });

    if (value) {
      await create('page', value, uri);
    }
  });

  registerCommand('MiniProgram.commands.create.component', async (e: vscode.Uri) => {
    const uri = vscode.Uri.parse(e.fsPath);
    const value = await vscode.window.showInputBox({
      prompt: '组件名称',
      placeHolder: '请输入组件名称，如：input',
      validateInput: validate,
    });

    if (value) {
      await create('component', value, uri);
    }
  });
}

function deactivate(): void { }

export {
  activate,
  deactivate,
};
