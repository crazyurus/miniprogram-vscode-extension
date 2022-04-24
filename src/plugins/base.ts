import * as vscode from 'vscode';

abstract class Plugin {
  abstract activate(context: vscode.ExtensionContext): void;
  deactivate(): void {}
}

export default Plugin;
