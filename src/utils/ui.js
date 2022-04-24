const vscode = require('vscode');
const commonHTML = require('../html/common');

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

function openWebView(url, title, position = vscode.ViewColumn.One, style = '') {
  const webviewPanel = vscode.window.createWebviewPanel(
    title, title,
    position,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  );

  if (url.indexOf('http') === 0) {
    webviewPanel.webview.html = commonHTML({
      style,
      url,
    });
  } else {
    webviewPanel.webview.html = url;
  }

  return webviewPanel;
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
  openWebView,
  openDocument,
};
