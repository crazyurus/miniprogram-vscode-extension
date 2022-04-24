const vscode = require('vscode');
const renderHTML = require('../html/render');

function showInputBox(options) {
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
};

function openWebView(html, title, position = vscode.ViewColumn.One) {
  const webviewPanel = vscode.window.createWebviewPanel(
    title, title,
    position,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  );

  webviewPanel.webview.html = html;

  return webviewPanel;
}

async function openURL(url, title) {
  const html = await renderHTML('common', {
    url,
  });

  return openWebView(html, title);
}

function openDocument(path) {
  return vscode.workspace.openTextDocument(path).then(document => vscode.window.showTextDocument(document, vscode.ViewColumn.One));
}

function showSaveDialog(options) {
  return vscode.window.showSaveDialog(options).then(result => result ? result.fsPath : '');
}

module.exports = {
  showInputBox,
  showSaveDialog,
  openURL,
  openWebView,
  openDocument,
};
