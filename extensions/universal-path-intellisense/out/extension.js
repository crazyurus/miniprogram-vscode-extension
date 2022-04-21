"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const providers_1 = require("./providers");
const tsconfig_service_1 = require("./configuration/tsconfig.service");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    /**
     * Subscribe to the ts config changes
     */
    context.subscriptions.push(...tsconfig_service_1.subscribeToTsConfigChanges());
    /**
     * Register Providers
     * Add new providers in src/providers/
     * */
    providers_1.providers.forEach((provider) => {
        const disposable = vscode_1.languages.registerCompletionItemProvider(provider.selector, provider.provider, ...(provider.triggerCharacters || []));
        context.subscriptions.push(disposable);
    });
    providers_1.defProviders.forEach((provider) => {
        const disposable = vscode_1.languages.registerDefinitionProvider(provider.selector, provider.provider);
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;