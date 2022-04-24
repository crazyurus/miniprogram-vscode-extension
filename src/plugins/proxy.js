const vscode = require('vscode');

function activate() {
  const proxy = vscode.workspace.getConfiguration('http').get('proxy');

  if (proxy) {
    const ci = require('miniprogram-ci');

    ci.proxy(proxy);
  }
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};
