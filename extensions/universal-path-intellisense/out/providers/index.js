"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_provider_1 = require("./default.provider");
const javascript_provider_1 = require("./javascript/javascript.provider");
const default_defFrovider_1 = require("./defProvider/default.defFrovider");
exports.providers = [
    javascript_provider_1.JavaScriptProvider,
    default_provider_1.DefaultProvider,
];
exports.defProviders = [
    default_defFrovider_1.DefaultDefProvider,
];
//index.js.map