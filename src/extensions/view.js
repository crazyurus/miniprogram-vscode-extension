const vscode = require('vscode');

class TreeDataProvider {
  getChildren(element) {
    if (!element) {
      return [
        {
          command: "MiniProgram.commands.simulator", 
          title: "启动模拟器"
        },
        {
          command: "MiniProgram.commands.compile.preview", 
          title: "扫码预览小程序"
        },
        {
          command: "MiniProgram.commands.compile.upload", 
          title: "打包并上传到微信后台"
        },
        {
          command: "MiniProgram.commands.compile.npm", 
          title: "构建 NPM"
        },
        {
          command: "MiniProgram.commands.config.project", 
          title: "查看项目配置"
        },
        {
          command: "MiniProgram.commands.document", 
          title: "查看开发文档"
        }
      ];
    }

    return [];
  }

  getTreeItem(element) {
   const treeItem = new vscode.TreeItem(element.title);
   treeItem.command = element;

   return treeItem;
  }
}

function activate(context) {
  vscode.window.registerTreeDataProvider(
    'miniprogram-view',
    new TreeDataProvider(),
  );
   
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
