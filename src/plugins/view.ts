import * as vscode from 'vscode';
import Plugin from './base';

interface TreeElement {
  command: string;
  title: string;
  icon?: string;
  children?: TreeElement[];
}

class TreeDataProvider implements vscode.TreeDataProvider<TreeElement> {
  getChildren(element?: TreeElement): TreeElement[] {
    if (element && element.children) {
      return element.children;
    }

    return [
      {
        command: 'MiniProgram.commands.config.openIDE',
        title: '打开微信开发者工具'
      },
      {
        command: 'MiniProgram.commands.compile.preview',
        title: '扫码预览小程序'
      },
      {
        command: 'MiniProgram.commands.compile.upload',
        title: '打包并上传小程序'
      },
      {
        command: 'MiniProgram.commands.compile.npm',
        title: '构建 NPM'
      },
      {
        command: 'MiniProgram.commands.compile.analyse',
        title: '分析代码静态依赖'
      },
      {
        command: 'MiniProgram.commands.config.project',
        title: '查看项目配置'
      },
      {
        command: 'MiniProgram.commands.compile.artifact',
        title: '查看编译产物'
      },
      {
        command: 'MiniProgram.commands.compile.sourceMap',
        title: '下载最近上传版本的 SourceMap'
      },
      {
        command: 'MiniProgram.commands.management',
        title: '打开微信小程序管理后台'
      },
      {
        command: '',
        title: '微信开发文档',
        children: [
          {
            command: 'MiniProgram.commands.document.open',
            title: '查看开发文档',
            icon: 'notebook-open-as-text',
          },
          {
            command: 'MiniProgram.commands.document.search',
            title: '搜索开发文档',
            icon: 'search-view-icon',
          },
        ],
      },
      {
        command: 'MiniProgram.commands.storage.clear',
        title: '清除缓存'
      },
    ];
  }

  getTreeItem(element: TreeElement): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(element.title);

    if (element.command) {
      treeItem.command = element;
    }

    if (element.children) {
      treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    }

    if (element.icon) {
      treeItem.iconPath = new vscode.ThemeIcon(element.icon);
    }

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
