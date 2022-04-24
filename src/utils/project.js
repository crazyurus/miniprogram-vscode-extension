const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { readJSON } = require('./json');
const { getCurrentFolderPath, getProjectConfigPath, getMiniProgramRootPath } = require('./path');

function getAppConfigPath(miniprogramPath) {
  if (!miniprogramPath) {
    const rootPath = getCurrentFolderPath();
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      return '';
    }

    miniprogramPath = getMiniProgramRootPath(rootPath, projectConfig.miniprogramRoot);
  }

  return path.join(miniprogramPath, 'app.json');
}

function readAppConfig(miniprogramPath) {
  const appFilePath = getAppConfigPath(miniprogramPath);

  return appFilePath ? readJSON(appFilePath) : null;
}

function readProjectConfig() {
  const rootPath = getCurrentFolderPath();
  const projectFilePath = getProjectConfigPath(rootPath);

  if (fs.existsSync(projectFilePath)) {
    const config = readJSON(projectFilePath);

    config.projectname = decodeURIComponent(config.projectname);

    return config;
  }

  return null;
}

async function createProject(context) {
  const privateKey = context.workspaceState.get('privateKey');
  const privateKeyPath = context.workspaceState.get('privateKeyPath'); // 废弃
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

  if (privateKey) {
    return {
      ...options,
      privateKey,
    };
  }

  // TODO: 废弃
  if (privateKeyPath && fs.existsSync(privateKeyPath)) {
    return {
      ...options,
      privateKeyPath,
    };
  }

  const action = await vscode.window.showInformationMessage('请选择代码上传密钥文件，代码上传密钥可以在微信小程序后台“开发”-“开发设置”功能生成并下载，并关闭 IP 白名单', {
      modal: true,
    }, '选择密钥文件', '查看详细说明');

  switch (action) {
    case '选择密钥文件':
      const result = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: {
          '代码上传密钥文件': ['key'],
        },
        openLabel: '选择',
      });
      if (Array.isArray(result)) {
        const keyFile = result[0].fsPath;
        const key = fs.readFileSync(keyFile, 'utf-8');
        context.workspaceState.update('privateKey', key);

        return {
          ...options,
          privateKey: key,
        };
      }
      break;
    case '查看详细说明':
      vscode.env.openExternal('https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html');
      break;
  }
}

module.exports = {
  getAppConfigPath,
  readAppConfig,
  readProjectConfig,
  createProject,
};
