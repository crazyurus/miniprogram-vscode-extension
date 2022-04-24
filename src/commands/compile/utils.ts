import * as vscode from 'vscode';
import type { CompileOptions } from '../../types';

function registerCommand(command: string, callback: (e: any) => void): void {
  vscode.commands.registerCommand(command, async e => {
    try {
      await callback(e);
    } catch (error: any) {
      vscode.window.showErrorMessage(error.message);
    }
  });
}

function getCIBot(): number {
  return 28;
}

function getCompileOptions(options: CompileOptions): {
  es6: boolean;
  es7: boolean;
  minify: boolean;
  autoPrefixWXSS: boolean;
  minifyWXML: boolean;
  minifyWXSS: boolean;
  minifyJS: boolean;
  codeProtect: boolean;
  uploadWithSourceMap: boolean;
} {
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

function getTemporaryFileName(type: string, appid: string, ext: string): string {
  const timestamp = Date.now();

  return `${type}-${appid}-${timestamp}.${ext}`;
}

export {
  getCIBot,
  getCompileOptions,
  getTemporaryFileName,
  registerCommand,
};
