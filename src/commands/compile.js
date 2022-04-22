const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { updateJSON } = require('../utils/json');
const { getCurrentFolderPath } = require('../utils/path');
const { readProjectConfig, createProject } = require('../utils/project');
const { openWebView, showInputBox, openDocument } = require('../utils/ui');
const { random } = require('../utils/math');
const previewHTML = require('../html/preview');

function getCIBot() {
  return random(1, 30);
}

function getCompileOptions(options) {
  return {
    es6: options.es6,
    es7: options.enhance,
    minify: options.minified,
    autoPrefixWXSS: options.postcss,
    minifyWXML: options.minified || options.minifyWXSS,
    minifyWXSS: options.minified || options.minifyWXML,
    minifyJS: options.minified,
    codeProtect: options.uglifyFileName,
    uploadWithSourceMap: options.uploadWithSourceMap,
  };
}

function compileDir() {
  vscode.commands.registerCommand('MiniProgram.commands.config.compileDir', e => {
    const rootPath = getCurrentFolderPath();
    const projectFilePath = path.join(rootPath, 'project.config.json');

    if (fs.existsSync(projectFilePath)) {
      updateJSON(projectFilePath, 'miniprogramRoot', e.fsPath);
      vscode.window.showInformationMessage('设置成功，当预览或上传小程序时，将仅打包此目录下的文件');
    } else {
      vscode.window.showErrorMessage('未找到 project.config.json 文件');
    }
  });
}

function compile(context) {
  const rootPath = getCurrentFolderPath();

  // 构建 npm
  vscode.commands.registerCommand('MiniProgram.commands.compile.npm', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      vscode.window.showWarningMessage('未找到 project.config.json 文件');
      return;
    }

    if (!fs.existsSync(path.join(rootPath, 'package.json'))) {
      vscode.window.showWarningMessage('未找到 package.json 文件');
      return;
    }

    const options = await createProject(context);

    await vscode.window.withProgress({
      title: '正在构建 NPM',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async () => {
      const ci = require('miniprogram-ci');
      const project = new ci.Project(options);

      await ci.packNpm(project, {
        reporter(info) {
          vscode.window.showInformationMessage(`构建完成，共用时 ${info.pack_time} ms，其中包含小程序依赖 ${info.miniprogram_pack_num} 项、其它依赖 ${info.other_pack_num} 项`);
        },
      }).catch(error => {
        vscode.window.showErrorMessage(error.message);
      });
    });
  });

  // 预览
  vscode.commands.registerCommand('MiniProgram.commands.compile.preview', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      vscode.window.showWarningMessage('未找到 project.config.json 文件');
      return;
    }

    const options = await createProject(context);
    const timestamp = new Date().valueOf();
    const tempImagePath = path.join(os.tmpdir(), options.appid + timestamp + '-qrcode.jpg');

    await vscode.window.withProgress({
      title: '正在编译小程序',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async progress => {
      const ci = require('miniprogram-ci');
      const project = new ci.Project(options);
      const { appName } = await project.attr();

      await ci.preview({
        project,
        desc: '来自 VSCode MiniProgram Extension',
        setting: getCompileOptions(projectConfig.setting),
        qrcodeFormat: 'base64',
        qrcodeOutputDest: tempImagePath,
        onProgressUpdate(message) {
          progress.report(message);
        },
        robot: getCIBot(),
      }).then(() => {
        if (!fs.existsSync(tempImagePath)) {
          vscode.window.showErrorMessage('构建失败');
          return;
        }

        const base64 = fs.readFileSync(tempImagePath, 'utf8');

        vscode.window.showInformationMessage('构建完成');
        openWebView(previewHTML({
          base64,
          appName,
        }), '预览小程序');
      }).catch(error => {
        vscode.window.showErrorMessage(error.message);
      });
    });
  });

  // 上传
  vscode.commands.registerCommand('MiniProgram.commands.compile.upload', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      vscode.window.showWarningMessage('未找到 project.config.json 文件');
      return;
    }

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
      const ci = require('miniprogram-ci');
      const project = new ci.Project(options);

      await ci.upload({
        project,
        version,
        desc: description || '通过%20MiniProgram%20VSCode%20Extension%20上传',
        setting: getCompileOptions(projectConfig.setting),
        onProgressUpdate(message) {
          progress.report(message);
        },
        robot: getCIBot(),
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

  // 代码分析
  vscode.commands.registerCommand('MiniProgram.commands.compile.analyse', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      vscode.window.showWarningMessage('未找到 project.config.json 文件');
      return;
    }

    const viewerPath = path.join(__dirname, '..', '..', 'analyse-viewer');
    let html = await fs.promises.readFile(path.join(viewerPath, 'index.html'), { encoding: 'utf-8' });
    const panel = openWebView('', '代码依赖分析', vscode.ViewColumn.One);
    html = html.replace(/vscode:\/\//g, panel.webview.asWebviewUri(vscode.Uri.file(viewerPath)).toString() + '/');
    panel.webview.html = html;
    panel.webview.onDidReceiveMessage(async message => {
      switch (message.command) {
        case 'syncState':
          panel.webview.postMessage({
            command: 'syncState',
            data: {
              analyseResult: null,
              currentModuleId: '',
              filterKeyword: '',
              filterType: 'all',
              navigatePath: '',
              sort: 'desc',
            },
          });

          break;
        case 'analyse':
          const options = await createProject(context);
          const ci = require('miniprogram-ci');
          const project = new ci.Project(options);
          const result = await ci.analyseCode(project);

          panel.webview.postMessage({
            command: 'updateState',
            data: {
              analyseResult: result,
            }
          });

          break;
        case 'report':
          const rootPath = getCurrentFolderPath();
          const filePath = message.data.ext.replace('topLevel/MainPackage', rootPath);

          if (message.data.action === 'clickTreemap' && fs.existsSync(filePath)) {
            openDocument(filePath);
          }

          break;
      }
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
