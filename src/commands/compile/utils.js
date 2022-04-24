const vscode = require('vscode');

function registerCommand(command, callback) {
  return vscode.commands.registerCommand(command, async e => {
    try {
      await callback(e);
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
    }
  });
}

function getCIBot() {
  return 28;
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

function getTemporaryFileName(type, appid, ext) {
  const timestamp = Date.now();

  return `${type}-${appid}-${timestamp}.${ext}`;
}

module.exports = {
  getCIBot,
  getCompileOptions,
  getTemporaryFileName,
  registerCommand,
};
