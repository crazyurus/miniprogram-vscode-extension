import * as vscode from 'vscode';
import Plugin from './base';

interface TreeElement {
  command: string;
  title: string;
}

class TreeDataProvider implements vscode.TreeDataProvider<TreeElement> {
  getChildren(element?: TreeElement): TreeElement[] {
    if (!element) {
      return [
        {
          command: "MiniProgram.commands.config.openIDE",
          title: "打开微信开发者工具"
        },
        {
          command: "MiniProgram.commands.compile.preview",
          title: "扫码预览小程序"
        },
        {
          command: "MiniProgram.commands.compile.upload",
          title: "打包并上传小程序"
        },
        {
          command: "MiniProgram.commands.compile.npm",
          title: "构建 NPM"
        },
        {
          command: "MiniProgram.commands.compile.analyse",
          title: "分析代码静态依赖"
        },
        {
          command: "MiniProgram.commands.config.project",
          title: "查看项目配置"
        },
        {
          command: "MiniProgram.commands.compile.artifact",
          title: "查看编译产物"
        },
        {
          command: "MiniProgram.commands.compile.sourceMap",
          title: "下载最近上传版本的 SourceMap"
        },
        {
          command: "MiniProgram.commands.management",
          title: "打开微信小程序管理后台"
        },
        {
          command: "MiniProgram.commands.document",
          title: "查看开发文档"
        },
        {
          command: "MiniProgram.commands.storage.clear",
          title: "清除缓存"
        }
      ];
    }

    return [];
  }

  getTreeItem(element: TreeElement): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(element.title);
    treeItem.command = element;

    return treeItem;
  }
}

class ViewPlugin extends Plugin {
  activate(): void {
    vscode.commands.executeCommand('setContext', 'extensionActivated', true);
    vscode.window.registerTreeDataProvider(
      'miniprogram-view',
      new TreeDataProvider(),
    );
  }

  deactivate(): void {
    vscode.commands.executeCommand('setContext', 'extensionActivated', false);
  }
}

export default new ViewPlugin();
