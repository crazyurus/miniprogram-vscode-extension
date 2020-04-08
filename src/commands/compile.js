const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const ci = require('miniprogram-ci');
const { updateJSON } = require('../utils/json');
const { getCurrentFolderPath } = require('../utils/path');
const { readProjectConfig } = require('../utils/project');

function createProject(context) {
  const privateKeyPath = context.workspaceState.get('privateKeyPath');
  const rootPath = getCurrentFolderPath();
  const projectConfig = readProjectConfig();
  const options = {
    appid: projectConfig.appid,
    type: projectConfig.compileType,
    projectPath: projectConfig.miniprogramRoot || rootPath,
    ignores: ['node_modules/**/*'],
  };

  if (!projectConfig) {
    return Promise.reject('未找到 project.config.json 文件');
  }

  if (privateKeyPath && fs.existsSync(privateKeyPath)) {
    return Promise.resolve(
      new ci.Project({
        ...options,
        privateKeyPath,
      })
    );
  }

  return new Promise((resolve, reject) => {
    vscode.window.showInformationMessage('请选择代码上传密钥文件，代码上传密钥可以在微信小程序后台“开发”-“开发设置”功能生成并下载，并关闭 IP 白名单', '打开微信小程序后台', '查看详细说明').then(result => {
      switch (result) {
        case '打开微信小程序后台':
          vscode.env.openExternal('https://mp.weixin.qq.com/');
          break;
        case '查看详细说明':
          vscode.env.openExternal('https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html');
          break;
      }
    });
    vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: {
        '代码上传密钥文件': ['key'],
      },
      openLabel: '选择',
    }).then(result => {
      if (Array.isArray(result)) {
        const keyFile = result[0].path;
        context.workspaceState.update('privateKeyPath', keyFile);

        resolve(
          new ci.Project({
            ...options,
            privateKeyPath: keyFile,
          })
        );
      } else {
        reject();
      }
    });
  });
}

function compileDir() {
  vscode.commands.registerCommand('MiniProgram.commands.config.compileDir', e => {
    const rootPath = getCurrentFolderPath();
    const projectFilePath = rootPath + path.sep + 'project.config.json';

    if (fs.existsSync(projectFilePath)) {
      updateJSON(projectFilePath, 'miniprogramRoot', e.fsPath);
      vscode.window.showInformationMessage('设置成功，当预览或上传小程序时，将仅打包此目录下的文件');
    } else {
      vscode.window.showErrorMessage('未找到 project.config.json 文件');
    }
  });
}

function compile(context) {
  vscode.commands.registerCommand('MiniProgram.commands.compile.npm', e => {
    const rootPath = getCurrentFolderPath();

    if (fs.existsSync(rootPath + path.sep + 'package.json')) {
      createProject(context).then(project => {
        ci.packNpm(project, {
          reporter(info) {
            vscode.window.showInformationMessage(`构建完成，共用时 ${info.pack_time} ms，其中包含小程序依赖 ${info.miniprogram_pack_num} 项、其它依赖 ${info.other_pack_num} 项`);
          },
        });
      }).catch(err => {
        if (err) {
          vscode.window.showErrorMessage(err);
        }
      });
    } else {
      vscode.window.showWarningMessage('未找到 package.json 文件');
    }
  });
}

function activate(context) {
  compileDir();
  compile(context);
}

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
