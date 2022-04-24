const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { getCurrentFolderPath } = require('../../utils/path');
const { readProjectConfig, createProject } = require('../../utils/project');
const { openWebView, openDocument } = require('../../utils/ui');

function analyseCode(context) {
  vscode.commands.registerCommand('MiniProgram.commands.compile.analyse', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      vscode.window.showWarningMessage('未找到 project.config.json 文件');
      return;
    }

    const viewerPath = path.join(__dirname, '..', '..', '..', 'analyse-viewer');
    let html = await fs.promises.readFile(path.join(viewerPath, 'index.html'), { encoding: 'utf-8' });
    const panel = openWebView('', '代码依赖分析', vscode.ViewColumn.One);
    html = html.replace(/vscode:\/\//g, panel.webview.asWebviewUri(vscode.Uri.file(viewerPath)).toString() + '/');
    panel.webview.html = html;
    panel.webview.onDidReceiveMessage(async message => {
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
          const ci = require('miniprogram-ci');
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

module.exports = analyseCode;
