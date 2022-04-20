const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { updateJSON } = require('../utils/json');
const { getCurrentFolderPath } = require('../utils/path');
const { readProjectConfig } = require('../utils/project');
const { openWebView, showInputBox } = require('../utils/ui');

function getCompileOptions(options) {
  return {
    es7: true,
    minify: options.minified,
    codeProtect: options.uglifyFileName,
    autoPrefixWXSS: options.postcss,
    uploadWithSourceMap: true,
  };
}

function getMiniProgramRootPath(rootPath, relativePath) {
  if (relativePath) {
    return path.resolve(rootPath, relativePath);
  }

  return rootPath;
}

function createProject(context) {
  const privateKeyPath = context.workspaceState.get('privateKeyPath');
  const rootPath = getCurrentFolderPath();
  const projectConfig = readProjectConfig();
  const options = {
    appid: projectConfig.appid,
    type: projectConfig.compileType === 'miniprogram' ? 'miniProgram' : 'miniProgramPlugin',
    projectPath: getMiniProgramRootPath(rootPath, projectConfig.miniprogramRoot),
    ignores: ['node_modules/**/*'],
  };

  if (!projectConfig) {
    return Promise.reject('未找到 project.config.json 文件');
  }

  if (privateKeyPath && fs.existsSync(privateKeyPath)) {
    return Promise.resolve({
      ...options,
      privateKeyPath,
    });
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
        const keyFile = result[0].fsPath;
        context.workspaceState.update('privateKeyPath', keyFile);

        resolve({
          ...options,
          privateKeyPath: keyFile,
        });
      } else {
        reject();
      }
    });
  });
}

function loadMiniprogramCI() {
  return new Promise(resolve => {
    setImmediate(() => {
      const ci = require('miniprogram-ci');

      resolve(ci);
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
  const projectConfig = readProjectConfig();
  const rootPath = getCurrentFolderPath();

  // 构建 npm
  vscode.commands.registerCommand('MiniProgram.commands.compile.npm', async () => {
    if (fs.existsSync(rootPath + path.sep + 'package.json')) {
      const options = await createProject(context);

      await vscode.window.withProgress({
        title: '正在构建 NPM',
        location: vscode.ProgressLocation.Notification,
        cancellable: true,
      }, async () => {
        const ci = await loadMiniprogramCI();
        const project = new ci.Project(options);

        await ci.packNpm(project, {
          reporter(info) {
            vscode.window.showInformationMessage(`构建完成，共用时 ${info.pack_time} ms，其中包含小程序依赖 ${info.miniprogram_pack_num} 项、其它依赖 ${info.other_pack_num} 项`);
          },
        }).catch(error => {
          vscode.window.showErrorMessage(error.message);
        });
      });
    } else {
      vscode.window.showWarningMessage('未找到 package.json 文件');
    }
  });

  // 预览
  vscode.commands.registerCommand('MiniProgram.commands.compile.preview', async () => {
    const options = await createProject(context);
    const timestamp = new Date().valueOf();
    const tempImagePath = os.tmpdir() + path.sep + options.appid + timestamp + '-qrcode.jpg';
    const projectConfig = readProjectConfig();

    await vscode.window.withProgress({
      title: '正在编译小程序',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async progress => {
      const ci = await loadMiniprogramCI();
      const project = new ci.Project(options);

      await ci.preview({
        project,
        desc: '来自 VSCode MiniProgram Extension',
        setting: getCompileOptions(projectConfig.setting),
        qrcodeFormat: 'base64',
        qrcodeOutputDest: tempImagePath,
        onProgressUpdate(message) {
          progress.report(message);
        }
      }).then(() => {
        if (!fs.existsSync(tempImagePath)) {
          vscode.window.showErrorMessage('构建失败');
          return;
        }

        const base64 = fs.readFileSync(tempImagePath, 'utf8');

        vscode.window.showInformationMessage('构建完成');
        openWebView(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  line-height: 1.6;
                }
                .title {
                  cursor: default;
                  text-align: center;
                  font-size: 20px;
                  margin-top: 30px;
                }
                .qrcode {
                  display: block;
                  width: 280px;
                  margin: 15px auto;
                  border: 1px solid #E2E2E2;
                }
                body.vscode-dark .footer {
                  background-color: #232323;
                  box-shadow: inset 0 5px 10px -5px #191919, 0 1px 0 0 #444;
                }
                .footer {
                  cursor: default;
                  box-sizing: border-box;
                  width: 280px;
                  margin: 0 auto;
                  border-radius: 100px;
                  font-size: 13px;
                  text-align: center;
                  padding: 7px 14px;
                }
              </style>
            </head>
            <body>
              <div class="title">微信小程序预览</div>
              <img class="qrcode" src="${base64}">
              <div class="footer">
                <div>请使用微信扫描二维码预览</div>
                <div>“${projectConfig.projectname}”</div>
              </div>
            </body>
          </html>
        `, '预览小程序');
      }).catch(error => {
        vscode.window.showErrorMessage(error.message);
      });
    });
  });

  // 上传
  vscode.commands.registerCommand('MiniProgram.commands.compile.upload', async () => {
    const options = await createProject(context);
    const previousVersion = context.workspaceState.get('previousVersion');
    const version = await showInputBox({
      title: '上传小程序',
      prompt: '版本号',
      placeholder: '请输入小程序版本号，' + (previousVersion ? '当前版本：' + previousVersion : '如：1.2.3'),
      step: 1,
      totalSteps: 2,
    });

    if (!version) {
      return;
    }

    const description = await showInputBox({
      title: '上传小程序',
      prompt: '项目备注',
      placeholder: '请输入项目备注（选填）',
      step: 2,
      totalSteps: 2,
    });

    await vscode.window.withProgress({
      title: '正在上传小程序',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async progress => {
      const ci = await loadMiniprogramCI();
      const project = new ci.Project(options);

      await ci.upload({
        project,
        version,
        desc: description || '通过%20MiniProgram%20VSCode%20Extension%20上传',
        setting: getCompileOptions(projectConfig.setting),
        onProgressUpdate(message) {
          progress.report(message);
        }
      }).then(() => {
        vscode.window.showInformationMessage('上传成功，可前往微信小程序后台提交审核并发布', '打开微信小程序后台').then(result => {
          switch (result) {
            case '打开微信小程序后台':
              vscode.env.openExternal('https://mp.weixin.qq.com/');
              break;
          }
        });

        context.workspaceState.update('previousVersion', version);
      }).catch(error => {
        vscode.window.showErrorMessage(error.message);
      });
    });
  });
}

function activate(context) {
  compileDir();
  compile(context);
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};
