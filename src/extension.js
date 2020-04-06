const WxmlExtension = require('./wxml');

function activate(context) {
  const plugins = [
    WxmlExtension,
  ];

  plugins.forEach(plugin => plugin.activate(context));
}

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
