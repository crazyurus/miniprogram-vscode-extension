const { loadMiniprogramCI } = require('../utils/ci');

function activate() {
  loadMiniprogramCI();
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};