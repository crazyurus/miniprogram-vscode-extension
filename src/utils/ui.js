const vscode = require('vscode');

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

function openWebView(url, title) {
  const webiewPanel = vscode.window.createWebviewPanel(
    'webview', title,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  );
  
  webiewPanel.webview.html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body, iframe {
            height: 100%;
            width: 100%;
            border: none;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <iframe src="${url}">
      </body>
    </html>
  `;

  return webiewPanel;
}

exports.showInputBox = showInputBox;
exports.openWebView = openWebView;