import * as fs from 'fs';
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

export {
  getAnalyseViewerPath,
  getCurrentFolderPath,
  getProjectConfigPath,
  getMiniProgramRootPath,
};
