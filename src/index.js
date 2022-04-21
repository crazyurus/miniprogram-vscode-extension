const ViewExtension = require('./extensions/view');
const CommandExtension = require('./commands');

const plugins = [
  ViewExtension,
  CommandExtension.create,
  CommandExtension.compile,
  CommandExtension.project,
  CommandExtension.document,
  CommandExtension.storage,
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
