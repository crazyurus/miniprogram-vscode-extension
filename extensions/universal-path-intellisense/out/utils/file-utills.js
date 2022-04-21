"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const minimatch = require("minimatch");
const path_1 = require("path");
const fs_1 = require("fs");
const { promisify } = require("util");
const readdirAsync = promisify(fs_1.readdir);
class FileInfo {
    constructor(path, file) {
        this.file = file;
        this.isFile = fs_1.statSync(path_1.join(path, file)).isFile();
    }
}
exports.FileInfo = FileInfo;
/**
 * @param fileName  {string} current filename the look up is done. Absolute path
 * @param text      {string} text in import string. e.g. './src/'
 */
function getPathOfFolderToLookupFiles(fileName, text, rootPath, mappings) {
    const normalizedText = path.normalize(text || "");
    const isPathAbsolute = normalizedText.startsWith(path.sep);
    let rootFolder = path.dirname(fileName);
    let pathEntered = normalizedText;
    // Search a mapping for the current text. First mapping is used where text starts with mapping
    const mapping = mappings &&
        mappings.reduce((prev, curr) => {
            return prev || (normalizedText.startsWith(curr.key) && curr);
        }, undefined);
    if (mapping) {
        rootFolder = mapping.value;
        pathEntered = normalizedText.substring(mapping.key.length, normalizedText.length);
    }
    if (isPathAbsolute) {
        rootFolder = rootPath || "";
    }
    return path.join(rootFolder, pathEntered);
}
exports.getPathOfFolderToLookupFiles = getPathOfFolderToLookupFiles;
function getChildrenOfPath(path, config) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield readdirAsync(path);
            return files
                .filter(filename => filterFile(filename, config))
                .map(f => new FileInfo(path, f));
        }
        catch (error) {
            return [];
        }
    });
}
exports.getChildrenOfPath = getChildrenOfPath;
function filterFile(filename, config) {
    if (config.showHiddenFiles) {
        return true;
    }
    return isFileHidden(filename, config) ? false : true;
}
function isFileHidden(filename, config) {
    return filename.startsWith(".") || isFileHiddenByVsCode(filename, config);
}
// files.exclude has the following form. key is the glob
// {
//    "**//*.js": true
//    "**//*.js": true "*.git": true
// }
function isFileHiddenByVsCode(filename, config) {
    return (config.filesExclude &&
        Object.keys(config.filesExclude).some(key => config.filesExclude[key] && minimatch(filename, key)));
}
//file-utills.js.map