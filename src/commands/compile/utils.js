const { random } = require('../../utils/math');

function getCIBot() {
  return random(1, 30);
}

function getCompileOptions(options) {
  return {
    es6: options.es6,
    es7: options.enhance,
    minify: options.minified,
    autoPrefixWXSS: options.postcss,
    minifyWXML: options.minified || options.minifyWXSS,
    minifyWXSS: options.minified || options.minifyWXML,
    minifyJS: options.minified,
    codeProtect: options.uglifyFileName,
    uploadWithSourceMap: options.uploadWithSourceMap,
  };
}

module.exports = {
  getCIBot,
  getCompileOptions,
};