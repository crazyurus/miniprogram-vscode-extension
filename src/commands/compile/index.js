const comipleCommands = [
  require('./analyse'),
  require('./directory'),
  require('./npm'),
  require('./preview'),
  require('./upload'),
];

function activate(context) {
  comipleCommands.forEach(command => command(context));
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
