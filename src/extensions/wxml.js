const vscode = require('vscode');
const JSBeautify = require('js-beautify')

var vkbeautify;

function VKBeautify() {
  var settings = vscode.workspace.getConfiguration();
  this.insertSpaces = settings.editor.insertSpaces
  this.step = settings.editor.insertSpaces ? settings.editor.tabSize : '\t';
  this.tabSize = settings.editor.tabSize
};

VKBeautify.prototype.xml = function(text, step) {
  const opts = JSBeautify.html.defaultOptions()
  opts.indent_size = this.step === '\t' ? 1 : this.tabSize
  opts.indent_char = this.step === '\t' ? '\t' : ' '
  opts.indent_with_tabs = this.insertSpaces
  opts.unformatted = opts.unformatted || []
  opts.unformatted.push('text')
  const res = JSBeautify.html(text, opts)
  return res
}

function updateVKBeautify() {
  vkbeautify = new VKBeautify();
}

updateVKBeautify();

function getRange(document) {

  return new vscode.Range(
    0, 0,
    document.lineCount - 1,
    document.lineAt(document.lineCount - 1).range.end.character
  )
}

function activate(context) {

  var disposableXML = vscode.languages.registerDocumentFormattingEditProvider({
    language: 'xml'
  }, {
    provideDocumentFormattingEdits: function(document) {
      return [vscode.TextEdit.replace(getRange(document), vkbeautify.xml(document.getText()))]
    }
  });
  vscode.workspace.onDidChangeConfiguration(updateVKBeautify, this, context.subscriptions);
  context.subscriptions.push(disposableXML);

  var disposableXSL = vscode.languages.registerDocumentFormattingEditProvider({
    language: 'xsl'
  }, {
    provideDocumentFormattingEdits: function(document) {
      return [vscode.TextEdit.replace(getRange(document), vkbeautify.xml(document.getText()))]
    }
  });
  vscode.workspace.onDidChangeConfiguration(updateVKBeautify, this, context.subscriptions);
  context.subscriptions.push(disposableXSL);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
