const WxmlExtension = require('./extensions/wxml');
const ViewExtension = require('./extensions/view');
const CommandExtension = require('./commands');

const plugins = [
  WxmlExtension,
  ViewExtension,
  CommandExtension.create,
  CommandExtension.compile,
  CommandExtension.project,
  CommandExtension.document,
];

function activate(context) {
  plugins.forEach(plugin => plugin.activate(context));
}

function deactivate() {
  plugins.forEach(plugin => plugin.deactivate());
}

exports.activate = activate;
exports.deactivate = deactivate;
