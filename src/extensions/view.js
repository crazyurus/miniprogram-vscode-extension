const vscode = require('vscode');

class TreeDataProvider {
  getChildren(element) {
    if (!element) {
      return [
        {
          command: "MiniProgram.commands.compile.preview", 
          title: "预览小程序"
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
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
