const vscode = require('vscode');

function activate(context) {
  vscode.commands.registerCommand('MiniProgram.commands.config.compileDir', e => {
    vscode.window.showInformationMessage('设置成功，当预览或上传小程序时，将仅打包此目录下的文件');
  });
}

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
