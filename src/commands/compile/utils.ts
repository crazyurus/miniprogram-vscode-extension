import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as vscode from 'vscode';

import { updateJSON } from '../../utils/json';
import { getCurrentFolderPath } from '../../utils/path';

async function saveMiniprogramProject(): Promise<void> {
  const rootPath = getCurrentFolderPath();
  const files = await vscode.window.showOpenDialog({
    defaultUri: vscode.Uri.file(rootPath),
    canSelectMany: false,
    filters: {
      项目配置文件: ['json']
    },
    openLabel: '选择'
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

function getCIBot(): number {
  return 28;
}

function getThreads(): number {
  return os.cpus().length * 2;
}

function getTemporaryFileName(type: string, appid: string, ext: string): string {
  const timestamp = Date.now();

  return `${type}-${appid}-${timestamp}.${ext}`;
}

export { getCIBot, getThreads, getTemporaryFileName, saveMiniprogramProject };
