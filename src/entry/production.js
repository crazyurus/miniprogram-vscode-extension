const Module = require('module');
const path = require('path');
const asarPath = path.join(__dirname, '..', 'node_modules.asar');
const nodeModulesPath = path.join(__dirname, '..', '..', 'node_modules');
const originalResolveLookupPaths = Module._resolveLookupPaths;

Module._resolveLookupPaths = function (moduleName, parent) {
  const paths = originalResolveLookupPaths(moduleName, parent);

  if (Array.isArray(paths)) {
    for (let i = 0, len = paths.length; i < len; i++) {
      if (paths[i] === nodeModulesPath) {
        paths.splice(i, 0, asarPath);
        break;
      }
    }
  }

  return paths;
};

const extension = require('./index');

module.exports = extension;
