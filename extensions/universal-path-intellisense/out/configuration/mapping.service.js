"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * From { "lib": "libraries", "other": "otherpath" }
 * To [ { key: "lib", value: "libraries" }, { key: "other", value: "otherpath" } ]
 * @param mappings { "lib": "libraries" }
 */
function parseMappings(mappings) {
    return Object.entries(mappings).map(([key, value]) => ({ key, value }));
}
exports.parseMappings = parseMappings;
/**
 * Replace ${workspaceRoot} with workfolder.uri.path
 * @param mappings
 * @param workfolder
 */
function replaceWorkspaceFolder(mappings, workfolder) {
    const rootPath = workfolder === null || workfolder === void 0 ? void 0 : workfolder.uri.path;
    if (rootPath) {
        /** Replace placeholder with workspace folder */
        return mappings.map(({ key, value }) => ({
            key,
            value: replaceWorkspaceFolderWithRootPath(value, rootPath),
        }));
    }
    else {
        /** Filter items out which contain a workspace root */
        return mappings.filter(({ value }) => !valueContainsWorkspaceFolder(value));
    }
}
exports.replaceWorkspaceFolder = replaceWorkspaceFolder;
/**
 * Replaces both placeholders with the rootpath
 * - ${workspaceRoot}    // old way and only legacy support
 * - ${workspaceFolder}  // new way
 * @param value
 * @param rootPath
 */
function replaceWorkspaceFolderWithRootPath(value, rootPath) {
    return value
        .replace("${workspaceRoot}", rootPath)
        .replace("${workspaceFolder}", rootPath);
}
function valueContainsWorkspaceFolder(value) {
    return (value.indexOf("${workspaceRoot}") >= 0 ||
        value.indexOf("${workspaceFolder}") >= 0);
}
//mapping.service.js.map