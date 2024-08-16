import fs from 'node:fs';
import path from 'node:path';
import * as ci from 'miniprogram-ci';
import * as vscode from 'vscode';

import { WebviewMessage } from '../../types';
import { getAnalyzeViewerPath, getCurrentFolderPath } from '../../utils/path';
import { createProject, readProjectConfig } from '../../utils/project';
import { openDocument, openWebView } from '../../utils/ui';
import Command from '../base';

class AnalyzeCommand extends Command {
  activate(context: vscode.ExtensionContext): void {
    this.register('MiniProgram.commands.compile.analyze', async () => {
      readProjectConfig();
      const viewerPath = getAnalyzeViewerPath();
      const options = await createProject(context);
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
              sort: 'desc'
            }
          });

          break;
        case 'analyse':
          const project = new ci.Project(options);
          const result = await ci.analyseCode(project);

          panel.webview.postMessage({
            command: 'updateState',
            data: {
              analyseResult: result
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
}

export default new AnalyzeCommand();
