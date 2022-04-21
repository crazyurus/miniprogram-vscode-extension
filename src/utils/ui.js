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
  const webiewPanel = vscode.window.createWebviewPanel(
    title, title,
    position,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  );

  if (url.indexOf('http') === 0) {
    webiewPanel.webview.html = commonHTML({
      style,
      url,
    });
  } else {
    webiewPanel.webview.html = url;
  }

  return webiewPanel;
}

exports.showInputBox = showInputBox;
exports.openWebView = openWebView;