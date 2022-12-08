const path = require('path');

require('ts-node').register({
  cwd: path.resolve(__dirname, '..', '..'),
});

const extension = require('../index');

module.exports = extension;
