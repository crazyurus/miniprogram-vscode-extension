const os = require('os');
const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const Registry = require('winreg');

function getCurrentFolderPath() {
  return Array.isArray(vscode.workspace.workspaceFolders)
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '';
}

async function getIDEPath() {
  const platform = os.platform();
  const idePath = {
    win32: {
      cil: 'C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat',
      exe: 'C:/Program Files (x86)/Tencent/微信web开发者工具/微信开发者工具.exe',
    },
    darwin: {
      cli: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
      exe: '/Applications/wechatwebdevtools.app'
    },
  };

  if (platform === 'win32') {
    const installPath = await new Promise((resolve, reject) => {
      new Registry({
        hive: Registry.HKLM,
        key: '\\SOFTWARE\\Wow6432Node\\Tencent\\微信web开发者工具',
      }).values((error, items) => {
        if (!error && items && items[0] && items[0].value) {
          resolve(path.join(items[0].value, '..'));
        } else {
          reject(error);
        }
      });
    });
    idePath[platform] = {
      cil: path.join(installPath, 'cli.bat'),
      exe: path.join(installPath, '微信开发者工具.exe'),
    };
  }

  if (idePath.hasOwnProperty(platform) && fs.existsSync(idePath[platform].cli)) {
    return idePath[platform];
  }

  return null;
}

module.exports = {
  getCurrentFolderPath,
  getIDEPath,
};
