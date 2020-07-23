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
    webiewPanel.webview.html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body {
              height: 100%;
              width: 100%;
              border: none;
              padding: 0;
              ${style}
            }

            iframe {
              height: 667px;
              width: 375px;
              border: none;
              padding: 0;
              ${style}
            }
          </style>
        </head>
        <body>
          <iframe src="${url}" onload="this.style.height=this.contentDocument.body.scrollHeight +'px';">
        </body>
      </html>
    `;
  } else {
    webiewPanel.webview.html = url;
  }

  return webiewPanel;
}

exports.showInputBox = showInputBox;
exports.openWebView = openWebView;