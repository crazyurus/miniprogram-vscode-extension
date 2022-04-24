import * as vscode from 'vscode';
import Plugin from './base';

const extensions = [
  require('../../extensions/engine-tutorial-plugin'),
  require('../../extensions/universal-path-intellisense'),
  require('../../extensions/wxml-language-features'),
];

class ExtensionPlugin extends Plugin {
  activate(context: vscode.ExtensionContext): void {
    extensions.forEach(extension => {
      const { activate } = extension;

      activate && activate(context);
    });
  }

  deactivate(): void {
    extensions.forEach(extension => {
      const { deactivate } = extension;

      deactivate && deactivate();
    });
  }
}

export default new ExtensionPlugin();
