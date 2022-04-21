function template(params) {
  with (params) {
    const items = form.map(item => `<div class="label">${item.label}</div><div class="value">${item.link ? `<a href="javascript:;" onclick="executeCommand('openProject')">${item.value}</a>` : item.value}</div>`).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              line-height: 1.5;
              margin: 36px 24px;
            }
            .app {
              display: flex;
              align-items: center;
              margin-bottom: 36px;
            }
            .app-avatar {
              border-radius: 50%;
              width: 64px;
              height: 64px;
              flex-shrink: 0;
              margin-right: 16px;
            }
            .app-name {
              font-size: 24px;
            }
            .form {
              display: grid;
              grid-template-columns: 2fr 3fr;
              grid-row-gap: 16px;
              grid-column-gap: 8px;
            }
            .form .label {
              color: var(--vscode-gitDecoration-ignoredResourceForeground);
            }
            .footer {
              margin-top: 16px;
            }
          </style>
          <script>
            const vscode = acquireVsCodeApi();
            function executeCommand(command) {
              vscode.postMessage({
                command,
              });
            }
          </script>
        </head>
        <body>
          <div class="app">
            <img class="app-avatar" src="${avatar}">
            <div class="app-name">${name}</div>
          </div>
          <div class="form">
            ${items}
          </div>
          <div class="footer">
            <a href="javascript:;" onclick="executeCommand('openConfig')">打开项目配置文件</a>
          </div>
        </body>
      </html>
    `;
  }
}

module.exports = template;
