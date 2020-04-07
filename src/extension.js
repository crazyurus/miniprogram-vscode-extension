const WxmlExtension = require('./wxml');
const CommandExtension = require('./commands');

const plugins = [
  WxmlExtension,
  CommandExtension.create,
  CommandExtension.compile,
  CommandExtension.project,
];

function activate(context) {
  plugins.forEach(plugin => plugin.activate(context));
}

function deactivate() {
  plugins.forEach(plugin => plugin.deactivate());
}

exports.activate = activate;
exports.deactivate = deactivate;
