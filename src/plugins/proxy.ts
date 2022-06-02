import * as vscode from 'vscode';
import Plugin from '../base';

class ProxyPlugin extends Plugin {
  async activate(): Promise<void> {
    const proxy = vscode.workspace.getConfiguration('http').get('proxy') as string;

    if (proxy) {
      const ci = await import('miniprogram-ci');

      ci.proxy(proxy);
    }
  }
}

export default new ProxyPlugin();
