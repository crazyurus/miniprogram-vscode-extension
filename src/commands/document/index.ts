import * as vscode from 'vscode';
import open from './open';
import search from './search';
import management from './management';

const documentCommands = [
  open,
  search,
  management
];

function activate(context: vscode.ExtensionContext): void {
  documentCommands.forEach(command => command(context));
}

function deactivate(): void {}

export {
  activate,
  deactivate,
};
