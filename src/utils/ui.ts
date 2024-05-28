import * as vscode from 'vscode';

import renderHTML from '../utils/render';

function showInputBox(options: Partial<vscode.InputBox>): Promise<string> {
  return new Promise(resolve => {
    const inputBox = vscode.window.createInputBox();

    inputBox.title = options.title;
    inputBox.step = options.step;
    inputBox.totalSteps = options.totalSteps;
    inputBox.placeholder = options.placeholder;
    inputBox.prompt = options.prompt;
    inputBox.show();

    inputBox.onDidAccept(() => {
      resolve(inputBox.value);
      inputBox.hide();
    });
  });
}

function openWebView(html: string, title: string, position = vscode.ViewColumn.One): vscode.WebviewPanel {
  const webviewPanel = vscode.window.createWebviewPanel(title, title, position, {
    enableScripts: true,
    retainContextWhenHidden: true
  });

  webviewPanel.webview.html = html;

  return webviewPanel;
}

async function openURL(url: string, title: string): Promise<vscode.WebviewPanel> {
  const html = await renderHTML('common', {
    url
  });

  return openWebView(html, title);
}

function openDocument(path: string): Promise<vscode.TextEditor> {
  return vscode.workspace
    .openTextDocument(path)
    .then(document => vscode.window.showTextDocument(document, vscode.ViewColumn.One)) as Promise<vscode.TextEditor>;
}

function showSaveDialog(options: vscode.SaveDialogOptions): Promise<string> {
  return vscode.window.showSaveDialog(options).then(result => (result ? result.fsPath : '')) as Promise<string>;
}

export { showInputBox, showSaveDialog, openURL, openWebView, openDocument };
