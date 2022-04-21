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
const vscode = require("vscode");
const JSON5 = require("json5");
const fs_1 = require("fs");
exports.getWorkfolderTsConfigConfiguration = memoize(function (workfolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const include = new vscode.RelativePattern(workfolder, "[tj]sconfig.json");
        const exclude = new vscode.RelativePattern(workfolder, "**/node_modules/**");
        const files = yield vscode.workspace.findFiles(include, exclude);
        return files.reduce((mappings, file) => {
            try {
                const parsedFile = JSON5.parse(fs_1.readFileSync(file.fsPath).toString());
                const newMappings = createMappingsFromWorkspaceConfig(parsedFile);
                return [...mappings, ...newMappings];
            }
            catch (error) {
                return mappings;
            }
        }, []);
    });
});
function subscribeToTsConfigChanges() {
    const disposables = [];
    for (const workfolder of vscode.workspace.workspaceFolders || []) {
        const pattern = new vscode.RelativePattern(workfolder, "[tj]sconfig.json");
        const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
        fileWatcher.onDidChange(() => invalidateCache(workfolder));
        disposables.push(fileWatcher);
    }
    return disposables;
}
exports.subscribeToTsConfigChanges = subscribeToTsConfigChanges;
function createMappingsFromWorkspaceConfig(tsconfig) {
    var _a;
    const mappings = [];
    const baseUrl = (_a = tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.compilerOptions) === null || _a === void 0 ? void 0 : _a.baseUrl;
    if (baseUrl) {
        mappings.push({
            key: baseUrl,
            // value: `${workfolder.uri.path}/${baseUrl}`
            value: "${workspaceFolder}/" + baseUrl,
        });
    }
    // Todo: paths property
    return mappings;
}
/** Caching */
let cachedMappings = new Map();
function memoize(fn) {
    function cachedFunction(workfolder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!workfolder) {
                return Promise.resolve([]);
            }
            const key = workfolder.name;
            const cachedMapping = cachedMappings.get(key);
            if (cachedMapping) {
                return cachedMapping;
            }
            else {
                let result = yield fn(workfolder);
                cachedMappings.set(key, result);
                return result;
            }
        });
    }
    return cachedFunction;
}
function invalidateCache(workfolder) {
    cachedMappings.delete(workfolder.name);
}
//tsconfig.service.js.map