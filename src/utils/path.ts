import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

function getAnalyseViewerPath(): string {
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
  const config = vscode.workspace.getConfiguration('miniprogram').get('miniprogramPath') as string;
  const configIdePath = vscode.workspace.getConfiguration('miniprogram').get('idePath') as string;

  if (config) {
    const miniprogramPath = path.resolve(rootPath, config);

    if (fs.existsSync(miniprogramPath)) {
      return miniprogramPath;
    }
  }

  return rootPath;
}

function getProjectConfigPath(rootPath: string): string {
  return path.join(rootPath, 'project.config.json')
}

function getIDEPathInfo(): {
  cliPath: string;
  statusFile: string;
} {
  const isWindows = os.platform() === 'win32';
  const devToolsInstallPath = configIdePath ? configIdePath : isWindows ? 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具' : '/Applications/wechatwebdevtools.app/Contents/MacOS';

  if (!fs.existsSync(devToolsInstallPath)) {
    throw new Error('未找到微信开发者工具 IDE');
  }

  const md5 = require('crypto').createHash('md5').update(devToolsInstallPath).digest('hex');
  const devToolsStatusFile = path.join(os.homedir(), isWindows
    ? `/AppData/Local/微信开发者工具/User Data/${md5}/Default/.ide-status`
    : `/Library/Application Support/微信开发者工具/${md5}/Default/.ide-status`
  );

  return {
    cliPath: path.join(devToolsInstallPath, isWindows ? 'cli.bat' : 'cli'),
    statusFile: devToolsStatusFile,
  };
}

export {
  getIDEPathInfo,
  getAnalyseViewerPath,
  getCurrentFolderPath,
  getProjectConfigPath,
  getMiniProgramRootPath,
};
