/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

            module.exports = require("vscode");

            /***/
}),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


            Object.defineProperty(exports, "__esModule", ({ value: true }));
            const vscode_1 = __webpack_require__(1);
            class Decoration {
                constructor(file, editor) {
                    this.file = '';
                    this.editor = null;
                    this.decorationTypes = [];
                    this.decorationOpt = {};
                    this.file = file;
                    this.editor = editor;
                    this.decorationOpt = {
                        backgroundColor: 'rgba(255,0,0,0.4)',
                        fontWeight: 'bold',
                    };
                    this.createDecorationType();
                }
                static getInstance(file, editor) {
                    if (!this._fileMap[file] && editor) {
                        this._fileMap[file] = new this(file, editor);
                    }
                    return this._fileMap[file];
                }
                static removeInstance(file) {
                    if (this._fileMap[file]) {
                        this._fileMap[file].clearDecorations();
                        delete this._fileMap[file];
                    }
                }
                static emptyInstances() {
                    for (const file in this._fileMap) {
                        this._fileMap[file].clearDecorations();
                    }
                    this._fileMap = [];
                }
                static generateRange(opt) {
                    const { startLine = this.defaultStartRow, startCol = this.defauleStartCol, endLine = this.defaultEndRow, endCol = this.defaultEndCol } = opt;
                    return new vscode_1.Range(startLine, startCol, endLine, endCol);
                }
                createDecorationType(opts = {}) {
                    const decorationOpt = Object.assign(Object.assign({}, this.decorationOpt), opts);
                    const decorationType = vscode_1.window.createTextEditorDecorationType(decorationOpt);
                    this.decorationTypes.push(decorationType);
                    return decorationType;
                }
                setDecorations(decorationType, ranges) {
                    this.editor.setDecorations(decorationType, ranges);
                }
                clearDecorations() {
                    if (this.decorationTypes.length) {
                        this.decorationTypes.forEach((decorationType) => {
                            decorationType.dispose();
                        });
                    }
                    this.decorationTypes = [];
                }
            }
            exports.default = Decoration;
            Decoration._fileMap = {};
            Decoration.defaultStartRow = 1;
            Decoration.defaultEndRow = 2;
            Decoration.defauleStartCol = 0;
            Decoration.defaultEndCol = 9999;


            /***/
})
/******/]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
            /******/
}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
            /******/
};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
        /******/
}
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    (() => {
        var exports = __webpack_exports__;

        Object.defineProperty(exports, "__esModule", ({ value: true }));
        exports.deactivate = exports.activate = void 0;
        const vscode = __webpack_require__(1);
        const decoration_1 = __webpack_require__(2);
        function activate(context) {
            let disposable = vscode.commands.registerCommand('workbench.enginetutorial', ({ data = {} }) => {
                onRemoteMessage(data);
            });
            context.subscriptions.push(disposable);
        }
        exports.activate = activate;
        function onRemoteMessage(data = {}) {
            console.log('[TutorialEngine]extension onRemoteMessage: ', data);
            const { action, file, tips = [] } = data;
            const editor = vscode.window.activeTextEditor;
            switch (action) {
                case 'highlight':
                    const instance = decoration_1.default.getInstance(file, editor);
                    let range, decorationType;
                    tips.forEach((tip = {}) => {
                        // 高亮
                        range = decoration_1.default.generateRange({
                            startLine: tip.lineStart,
                            endLine: tip.lineEnd,
                        });
                        decorationType = instance.createDecorationType();
                        instance.setDecorations(decorationType, [range]);
                        // 注释
                        range = decoration_1.default.generateRange({
                            startLine: tip.lineStart,
                            endLine: tip.lineStart,
                        });
                        decorationType = instance.createDecorationType({
                            after: {
                                contentText: tip.tipText ? `// [tips]: ${tip.tipText}` : '',
                                textDecoration: 'color:#ccc; opacity:0.6;',
                                margin: "0px 20px",
                            }
                        });
                        instance.setDecorations(decorationType, [range]);
                    });
                    break;
                case 'cleanHighlight':
                    decoration_1.default.removeInstance(file);
                    break;
                case 'cleanAllHighlight':
                    decoration_1.default.emptyInstances();
                    break;
            }
        }
        // this method is called when your extension is deactivated
        function deactivate() { }
        exports.deactivate = deactivate;

    })();

    module.exports = __webpack_exports__;
    /******/
})()
    ;
