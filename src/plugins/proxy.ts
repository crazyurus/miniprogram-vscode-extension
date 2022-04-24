import * as vscode from 'vscode';
import Plugin from './base';

class ProxyPlugin extends Plugin {
  activate(): void {
    const proxy = vscode.workspace.getConfiguration('http').get('proxy');

    if (proxy) {
      const ci = require('miniprogram-ci');

      ci.proxy(proxy);
    }
  }
}

export default new ProxyPlugin();
