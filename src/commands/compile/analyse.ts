import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getCurrentFolderPath, getAnalyseViewerPath } from '../../utils/path';
import { readProjectConfig, createProject } from '../../utils/project';
import { openWebView, openDocument } from '../../utils/ui';
import { registerCommand } from './utils';
import { WebviewMessage } from '../../types';

function analyseCode(context: vscode.ExtensionContext): void {
  registerCommand('MiniProgram.commands.compile.analyse', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      throw new Error('未找到 project.config.json 文件');
    }

    const viewerPath = getAnalyseViewerPath();
    let html = await fs.promises.readFile(path.join(viewerPath, 'index.html'), { encoding: 'utf-8' });
    const panel = openWebView('', '代码依赖分析', vscode.ViewColumn.One);
    html = html.replace(/vscode:\/\//g, panel.webview.asWebviewUri(vscode.Uri.file(viewerPath)).toString() + '/');
    panel.webview.html = html;
    panel.webview.onDidReceiveMessage(async (message: WebviewMessage) => {
      switch (message.command) {
        case 'syncState':
          panel.webview.postMessage({
            command: 'syncState',
            data: {
              analyseResult: null,
              currentModuleId: '',
              filterKeyword: '',
              filterType: 'all',
              navigatePath: '',
              sort: 'desc',
            },
          });

          break;
        case 'analyse':
          const options = await createProject(context);
          const ci = await import('miniprogram-ci');
          const project = new ci.Project(options);
          const result = await ci.analyseCode(project);

          panel.webview.postMessage({
            command: 'updateState',
            data: {
              analyseResult: result,
            }
          });

          break;
        case 'report':
          const rootPath = getCurrentFolderPath();
          const filePath = message.data.ext.replace('topLevel/MainPackage', rootPath);

          if (message.data.action === 'clickTreemap' && fs.existsSync(filePath)) {
            openDocument(filePath);
          }

          break;
      }
    });
  });
}

export default analyseCode;
