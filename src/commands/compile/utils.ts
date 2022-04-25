import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getCurrentFolderPath } from '../../utils/path';
import { updateJSON } from '../../utils/json';
import type { CompileOptions } from '../../types';

async function saveMiniprogramProject(): Promise<void> {
  const rootPath = getCurrentFolderPath();
  const files = await vscode.window.showOpenDialog({
    defaultUri: vscode.Uri.file(rootPath),
    canSelectMany: false,
    filters: {
      '项目配置文件': ['json'],
    },
    openLabel: '选择',
  });

  if (!Array.isArray(files)) {
    return;
  }

  const configFile = files[0].fsPath;
  const relativePath = path.relative(rootPath, path.join(configFile, '..'));
  const vscodePath = path.join(rootPath, '.vscode');

  if (!fs.existsSync(vscodePath)) {
    await fs.promises.mkdir(vscodePath);
  }

  await updateJSON(path.join(vscodePath, 'settings.json'), 'miniprogram.miniprogramPath', relativePath);

  vscode.window.showInformationMessage('设置成功，请重新尝试之前的操作');
}

function registerCommand(command: string, callback: (e: any) => void): void {
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

function getCIBot(): number {
  return 28;
}

function getCompileOptions(options: CompileOptions): {
  es6: boolean;
  es7: boolean;
  minify: boolean;
  autoPrefixWXSS: boolean;
  minifyWXML: boolean;
  minifyWXSS: boolean;
  minifyJS: boolean;
  codeProtect: boolean;
  uploadWithSourceMap: boolean;
} {
  return {
    es6: options.es6,
    es7: options.enhance,
    minify: options.minified,
    autoPrefixWXSS: options.postcss,
    minifyWXML: options.minified || options.minifyWXSS,
    minifyWXSS: options.minified || options.minifyWXML,
    minifyJS: options.minified,
    codeProtect: options.uglifyFileName,
    uploadWithSourceMap: options.uploadWithSourceMap,
  };
}

function getTemporaryFileName(type: string, appid: string, ext: string): string {
  const timestamp = Date.now();

  return `${type}-${appid}-${timestamp}.${ext}`;
}

export {
  getCIBot,
  getCompileOptions,
  getTemporaryFileName,
  registerCommand,
};
