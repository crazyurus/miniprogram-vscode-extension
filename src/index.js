require('ts-node').register();

const CommandPlugin = require('./commands');
const { default: ViewPlugin } = require('./plugins/view');
const { default: ExtensionPlugin } = require('./plugins/extension');
const { default: TypeScriptPlugin } = require('./plugins/typescript');
const { default: ProxyPlugin } = require('./plugins/proxy');

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

function activate(context) {
  plugins.forEach(plugin => plugin.activate(context));
}

function deactivate() {
  plugins.forEach(plugin => plugin.deactivate());
}

module.exports = {
  activate,
  deactivate,
};
