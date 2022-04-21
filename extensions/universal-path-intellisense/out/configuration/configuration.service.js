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
const tsconfig_service_1 = require("./tsconfig.service");
const mapping_service_1 = require("./mapping.service");
function getConfiguration(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(resource);
        const getConfig = (key) => vscode.workspace.getConfiguration(key, resource);
        const cfgExtension = getConfig("universal-path-intellisense");
        const cfgGeneral = getConfig("files");
        const mappings = yield getMappings(cfgExtension, workspaceFolder);
        return {
            autoSlash: cfgExtension["autoSlashAfterDirectory"],
            showHiddenFiles: cfgExtension["showHiddenFiles"],
            withExtension: cfgExtension["extensionOnImport"],
            absolutePathToWorkspace: cfgExtension["absolutePathToWorkspace"],
            filesExclude: cfgGeneral["exclude"],
            mappings,
            noExtensionFileWhiteList: cfgExtension["noExtensionFileWhiteList"]
        };
    });
}
exports.getConfiguration = getConfiguration;
function getMappings(configuration, workfolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const mappings = mapping_service_1.parseMappings(configuration["mappings"]);
        const tsConfigMappings = yield tsconfig_service_1.getWorkfolderTsConfigConfiguration(workfolder);
        const allMappings = [...mappings, ...tsConfigMappings];
        return mapping_service_1.replaceWorkspaceFolder(allMappings, workfolder);
    });
}
//configuration.service.js.map