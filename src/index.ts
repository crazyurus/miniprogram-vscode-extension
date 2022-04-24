import * as vscode from 'vscode';

import * as CommandPlugin from './commands';
import ViewPlugin from'./plugins/view';
import ExtensionPlugin from'./plugins/extension';
import TypeScriptPlugin from'./plugins/typescript';
import ProxyPlugin from'./plugins/proxy';

const plugins = [
  ViewPlugin,
  CommandPlugin.create,
  CommandPlugin.compile,
  CommandPlugin.project,
  CommandPlugin.document,
  CommandPlugin.storage,
  ExtensionPlugin,
  TypeScriptPlugin,
  ProxyPlugin,
];

function activate(context: vscode.ExtensionContext) {
  plugins.forEach(plugin => plugin.activate(context));
}

function deactivate() {
  plugins.forEach(plugin => plugin.deactivate());
}

module.exports = {
  activate,
  deactivate,
};
