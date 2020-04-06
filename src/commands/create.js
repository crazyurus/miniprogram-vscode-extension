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
    const projectPath = vscode.workspace.rootPath;
    let currentPath = uri.path;

    while (
      !fs.existsSync(currentPath + path.sep + 'app.json') &&
      currentPath !== projectPath
      ) {
      currentPath = currentPath.split(path.sep).slice(0, -1).join(path.sep);
    }

    const appConfigFile = currentPath + path.sep + 'app.json';

    if (fs.existsSync(appConfigFile)) {
      const content = fs.readFileSync(appConfigFile);
      const appConfig = JSON.parse(content);
      const pagePath = uri.path
        .replace(currentPath, '')
        .slice(1);

      appConfig.pages.push(pagePath + '/' + value);

      fs.writeFileSync(appConfigFile, JSON.stringify(appConfig, null, 2));
    }
  }

  vscode.window.showInformationMessage(name + ' ' + value + ' 创建成功');
}

function validate(name) {
  if (/^[a-zA-Z0-9-]+$/.test(name)) return null;
  return '名称只能包含数字、字母、中划线';
}

function activate(context) {
  vscode.commands.registerCommand('MiniProgram.commands.create.page', e => {
    const uri = vscode.Uri.parse(e.fsPath);	
    	
    vscode.window.showInputBox({
      prompt: '页面名称',
      placeHolder: '请输入页面名称，如：index',
      validateInput: validate
    }).then(value => {
      if (value) {
        create('page', value, uri);
      }
    });
  });

  vscode.commands.registerCommand('MiniProgram.commands.create.component', e => {
    const uri = vscode.Uri.parse(e.fsPath);	
    	
    vscode.window.showInputBox({
      prompt: '组件名称',
      placeHolder: '请输入组件名称，如：input',
      validateInput: validate
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
