import * as vscode from 'vscode';
import analyse from './analyse';
import directory  from './directory';
import npm from './npm';
import preview from './preview';
import upload from './upload';
import artifact from './artifact';
import sourcemap from './sourcemap';

const comipleCommands = [
  analyse,
  directory,
  npm,
  preview,
  upload,
  artifact,
  sourcemap
];

function activate(context: vscode.ExtensionContext): void {
  comipleCommands.forEach(command => command(context));
}

function deactivate(): void {}

export {
  activate,
  deactivate,
};
