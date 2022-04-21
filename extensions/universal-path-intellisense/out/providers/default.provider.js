"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const javascript_provider_1 = require("./javascript/javascript.provider");
exports.DefaultProvider = {
    selector: {
        language: "wxml",
        scheme: "file",
    },
    provider: javascript_provider_1.JavaScriptProvider.provider,
    triggerCharacters: ["/", '"', "'"]
};
//default.provider.js.map