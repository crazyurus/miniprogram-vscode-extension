import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as vscode from 'vscode';

import { readJSON } from './json';

function getAnalyzeViewerPath(): string {
  return path.join(__dirname, '..', '..', 'extensions', 'analyse-viewer');
}

function getMiniProgramRootPath(rootPath: string, relativePath?: string): string {
  if (relativePath) {
    return path.resolve(rootPath, relativePath);
  }

  return rootPath;
}

function getCurrentFolderPath(): string {
  const rootPath = Array.isArray(vscode.workspace.workspaceFolders)
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '';
  const configMiniprogramPath = vscode.workspace.getConfiguration('miniprogram').get('miniprogramPath') as string;

  if (configMiniprogramPath) {
    const miniprogramPath = path.resolve(rootPath, configMiniprogramPath);

    if (fs.existsSync(miniprogramPath)) {
      return miniprogramPath;
    }
  }

  return rootPath;
}

function getProjectConfigPath(rootPath: string): string {
  return path.join(rootPath, 'project.config.json');
}

function getIDEPathInfo(): {
  cliPath: string;
  exePath: string;
  statusFile: string;
  } {
  const configIDEPath = vscode.workspace.getConfiguration('miniprogram').get('idePath') as string;
  const isWindows = os.platform() === 'win32';
  const devToolsInstallPath =
    configIDEPath ||
    (isWindows
      ? 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具'
      : '/Applications/wechatwebdevtools.app/Contents/MacOS');

  if (!fs.existsSync(devToolsInstallPath)) {
    throw new Error('未找到微信开发者工具 IDE');
  }

  const versionFilePath = path.join(devToolsInstallPath, isWindows ? 'version' : '../Resources/version');
  let version = '';

  if (fs.existsSync(versionFilePath)) {
    const { latestNw } = readJSON(versionFilePath) || {};

    version = latestNw;
  }

  const md5 = crypto
    .createHash('md5')
    .update(devToolsInstallPath + version)
    .digest('hex');
  const devToolsStatusFile = path.join(
    os.homedir(),
    isWindows
      ? `/AppData/Local/微信开发者工具/User Data/${md5}/Default/.ide-status`
      : `/Library/Application Support/微信开发者工具/${md5}/Default/.ide-status`
  );

  return {
    cliPath: path.join(devToolsInstallPath, isWindows ? 'cli.bat' : 'cli'),
    exePath: path.join(devToolsInstallPath, isWindows ? '微信开发者工具.exe' : '../../'),
    statusFile: devToolsStatusFile
  };
}

export { getIDEPathInfo, getAnalyzeViewerPath, getCurrentFolderPath, getProjectConfigPath, getMiniProgramRootPath };
