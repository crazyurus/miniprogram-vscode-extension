"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function createPathCompletionItem(fileInfo, config, context) {
    return fileInfo.isFile
        ? createFileItem(fileInfo, config, context)
        : createFolderItem(fileInfo, config.autoSlash, context.importRange);
}
exports.createPathCompletionItem = createPathCompletionItem;
function createFolderItem(fileInfo, autoSlash, importRange) {
    var newText = autoSlash ? `${fileInfo.file}/` : `${fileInfo.file}`;
    return {
        label: fileInfo.file,
        kind: vscode.CompletionItemKind.Folder,
        textEdit: new vscode.TextEdit(importRange, newText),
        sortText: `a_${fileInfo.file}`,
    };
}
function createFileItem(fileInfo, config, context) {
    const textEdit = createCompletionItemTextEdit(fileInfo, config, context);
    return {
        label: fileInfo.file,
        kind: vscode.CompletionItemKind.File,
        sortText: `b_${fileInfo.file}`,
        textEdit,
    };
}
function createCompletionItemTextEdit(fileInfo, config, context) {
    // if (config.withExtension || !context.isImport) {
    //   return undefined;
    // }
    var _a;
    const fragments = fileInfo.file.split(".");
    const extension = (_a = fragments[fragments.length - 1]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    // if (extension !== context.documentExtension) {
    //   return undefined;
    // }
    let index = fileInfo.file.lastIndexOf(".");
    let newText = '';
    // 如果后缀不在白名单中，则补全后缀白名单
    if (Array.isArray(config.noExtensionFileWhiteList) && !config.noExtensionFileWhiteList.includes(extension)) {
        newText = fileInfo.file;
    }
    else {
        newText = index !== -1 ? fileInfo.file.substring(0, index) : fileInfo.file;
    }
    return new vscode.TextEdit(context.importRange, newText);
}
//createCompletionItem.js.map