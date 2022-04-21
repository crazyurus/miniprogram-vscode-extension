const ViewPlugin = require('./plugins/view');
const ExtensionPlugin = require('./plugins/extension');
const CommandPlugin = require('./commands');

const plugins = [
  ViewPlugin,
  CommandPlugin.create,
  CommandPlugin.compile,
  CommandPlugin.project,
  CommandPlugin.document,
  CommandPlugin.storage,
  ExtensionPlugin,
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
