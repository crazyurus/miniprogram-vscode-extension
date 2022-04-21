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
const configuration_service_1 = require("../../configuration/configuration.service");
const createContext_1 = require("./createContext");
const createCompletionItem_1 = require("./createCompletionItem");
const file_utills_1 = require("../../utils/file-utills");
exports.JavaScriptProvider = {
    selector: {
        language: "json",
        scheme: "file",
    },
    provider: {
        provideCompletionItems,
    },
    triggerCharacters: ["/", '"', "'"],
};
function provideCompletionItems(document, position) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = createContext_1.createContext(document, position);
        const config = yield configuration_service_1.getConfiguration(document.uri);
        return shouldProvide(context, config)
            ? provide(context, config)
            : Promise.resolve([]);
    });
}
/**
 * Checks if we should provide any CompletionItems
 * @param context
 * @param config
 */
function shouldProvide(context, config) {
    const { fromString, isImport } = context;
    if (!fromString || fromString.length === 0) {
        return false;
    }
    if (!isImport) {
        return true;
    }
    const startsWithDot = fromString[0] === ".";
    const startsWithMapping = config.mappings.some(({ key }) => fromString.startsWith(key));
    return isImport && (startsWithDot || startsWithMapping);
}
/**
 * Provide Completion Items
 */
function provide(context, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspace = vscode.workspace.getWorkspaceFolder(context.document.uri);
        const rootPath = config.absolutePathToWorkspace
            ? workspace === null || workspace === void 0 ? void 0 : workspace.uri.fsPath : undefined;
        const path = file_utills_1.getPathOfFolderToLookupFiles(context.document.uri.fsPath, context.fromString, rootPath, config.mappings);
        const childrenOfPath = yield file_utills_1.getChildrenOfPath(path, config);
        return [
            ...childrenOfPath.map((child) => createCompletionItem_1.createPathCompletionItem(child, config, context)),
        ];
    });
}
//javascript.provider.js.map