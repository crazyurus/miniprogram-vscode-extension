const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { updateJSON } = require('../utils/json');
const { getAppConfigPath } = require('../utils/project');

const pageTemplate = require('../templates/page');
const componentTemplate = require('../templates/component');

function create(type, value, uri) {
  const template = type === 'page' ? pageTemplate : componentTemplate;
  const name = type === 'page' ? '页面' : '组件';

  for (let ext in template) {
    const filePath = path.join(uri.fsPath, `${value}.${ext}`);

    if (fs.existsSync(filePath)) {
      vscode.window.showErrorMessage(name + ' ' + value + ' 已存在');
      return;
    }

    fs.writeFileSync(filePath, template[ext].trim());
  }

  if (type === 'page') {
    const appConfigFile = getAppConfigPath();
    const projectPath = path.join(appConfigFile, '..');

    if (fs.existsSync(appConfigFile)) {
      const pagePath = path.relative(projectPath, uri.fsPath).replace(path.sep, '/');

      if (pagePath.includes('..')) {
        vscode.window.showErrorMessage('页面路径不能超过小程序根目录');
        return;
      }

      updateJSON(appConfigFile, 'pages', pagePath + '/' + value, 'push');
    }
  }

  vscode.window.showInformationMessage(name + ' ' + value + ' 创建成功');
}

function validate(name) {
  if (/^[a-zA-Z0-9-]+$/.test(name)) return null;
  return '名称只能包含数字、字母、中划线';
}

function activate() {
  vscode.commands.registerCommand('MiniProgram.commands.create.page', e => {
    const uri = vscode.Uri.parse(e.fsPath);	
    	
    vscode.window.showInputBox({
      prompt: '页面名称',
      placeHolder: '请输入页面名称，如：index',
      validateInput: validate,
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
      validateInput: validate,
    }).then(value => {
      if (value) {
        create('component', value, uri);
      }
    });
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
