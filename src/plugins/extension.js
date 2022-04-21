const path = require('path');
const extensions = require('../../extensions');

function activate(context) {
  extensions.forEach(extension => {
    const { activate } = require(path.join('..', extension));

    activate && activate(context);
  });
}

function deactivate() {
  extensions.forEach(extension => {
    const { deactivate } = require(path.join('..', extension));

    deactivate && deactivate();
  });
}

module.exports = {
  activate,
  deactivate,
};