const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const pageTemplate = require('../templates/page');
const componentTemplate = require('../templates/component');

function create(type, value, uri) {
  const template = type === 'page' ? pageTemplate : componentTemplate;
  const name = type === 'page' ? '页面' : '组件';

  for (let ext in template) {
    const filePath = `${uri.path}${path.sep}${value}.${ext}`;

    if (fs.existsSync(filePath)) {
      vscode.window.showErrorMessage(name + ' ' + value + ' 已存在');
      return;
    }

    fs.writeFileSync(filePath, template[ext].trim());
  }

  if (type === 'page') {
    const projectFolder = vscode.workspace.filePath;
    // TODO: 更新 app.json
    console.log(projectFolder);
  }

  vscode.window.showInformationMessage(name + ' ' + value + ' 创建成功');
}

function activate(context) {
  vscode.commands.registerCommand('MiniProgram.commands.create.page', e => {
    const uri = vscode.Uri.parse(e.fsPath);	
    	
    vscode.window.showInputBox({
      placeHolder: '请输入页面名称，如：index',
    }).then(value => {
      if (value) {
        create('page', value, uri);
      }
    });
  });

  vscode.commands.registerCommand('MiniProgram.commands.create.component', e => {
    const uri = vscode.Uri.parse(e.fsPath);	
    	
    vscode.window.showInputBox({
      placeHolder: '请输入组件名称，如：input',
    }).then(value => {
      if (value) {
        create('component', value, uri);
      }
    });
  });
}

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
