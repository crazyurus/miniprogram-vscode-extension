import Plugin from '../base';

class ExtensionPlugin extends Plugin {
  dependencies = [
    require('../../extensions/engine-tutorial-plugin'),
    require('../../extensions/universal-path-intellisense'),
    require('../../extensions/wxml-language-features'),
    require('../../extensions/wechat-miniprogram-development')
  ];
}

export default new ExtensionPlugin();
