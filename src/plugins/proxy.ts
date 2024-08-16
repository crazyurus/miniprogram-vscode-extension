import * as ci from 'miniprogram-ci';
import * as vscode from 'vscode';

import Plugin from '../base';

class ProxyPlugin extends Plugin {
  activate(): void {
    const proxy = vscode.workspace.getConfiguration('http').get('proxy') as string;

    if (proxy) {
      ci.proxy(proxy);
    }
  }
}

export default new ProxyPlugin();
