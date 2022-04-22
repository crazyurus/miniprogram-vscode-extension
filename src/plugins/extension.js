const extensions = [
  require('../../extensions/engine-tutorial-plugin'),
  require('../../extensions/universal-path-intellisense'),
  require('../../extensions/wxml-language-features'),
];

function activate(context) {
  extensions.forEach(extension => {
    const { activate } = extension;

    activate && activate(context);
  });
}

function deactivate() {
  extensions.forEach(extension => {
    const { deactivate } = extension;

    deactivate && deactivate();
  });
}

module.exports = {
  activate,
  deactivate,
};