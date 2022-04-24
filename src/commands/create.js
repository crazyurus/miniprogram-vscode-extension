const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { updateJSON } = require('../utils/json');
const { getAppConfigPath } = require('../utils/project');
const { registerCommand } = require('./compile/utils');

const pageTemplate = require('../templates/page');
const componentTemplate = require('../templates/component');

async function create(type, value, uri) {
  const template = type === 'page' ? pageTemplate : componentTemplate;
  const name = type === 'page' ? '页面' : '组件';

  for (let ext in template) {
    const filePath = path.join(uri.fsPath, `${value}.${ext}`);

    if (fs.existsSync(filePath)) {
      throw new Error(name + ' ' + value + ' 已存在');
    }

    await fs.promises.writeFile(filePath, template[ext].trim());
  }

  if (type === 'page') {
    const appConfigFile = getAppConfigPath();
    const projectPath = path.join(appConfigFile, '..');

    if (fs.existsSync(appConfigFile)) {
      const pagePath = path.relative(projectPath, uri.fsPath).replace(path.sep, '/');

      if (pagePath.includes('..')) {
        throw new Error('页面路径不能超过小程序根目录');
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
  registerCommand('MiniProgram.commands.create.page', async e => {
    const uri = vscode.Uri.parse(e.fsPath);
    const value = await vscode.window.showInputBox({
      prompt: '页面名称',
      placeHolder: '请输入页面名称，如：index',
      validateInput: validate,
    });

    if (value) {
      await create('page', value, uri);
    }
  });

  registerCommand('MiniProgram.commands.create.component', async e => {
    const uri = vscode.Uri.parse(e.fsPath);
    const value = await vscode.window.showInputBox({
      prompt: '组件名称',
      placeHolder: '请输入组件名称，如：input',
      validateInput: validate,
    });

    if (value) {
      await create('component', value, uri);
    }
  });
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};
