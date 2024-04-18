# 微信小程序开发工具

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/crazyurus.miniprogram-vscode-extension) ![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/crazyurus.miniprogram-vscode-extension) ![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/crazyurus.miniprogram-vscode-extension)
![publish](https://github.com/crazyurus/miniprogram-vscode-extension/actions/workflows/build.yml/badge.svg)

提供预览、打包上传、代码补全、语法高亮、依赖分析、项目模版等功能。可以在面板的底部“微信小程序”处使用，如下图所示。

![微信小程序开发工具](https://sf3-cn.feishucdn.com/obj/eden-cn/eseh7nupevhps/miniprogram-vscode-extension/analyse-viewer.png)

## 功能

### 代码补全与语法高亮

- 支持小程序 API 的代码补全
- 支持 `WXML` 中组件的代码补全
- 支持 `WXML` `WXSS` `WXS` 的语法高亮
- 支持快速创建 `Page` 及 `Component`

### 预览和上传小程序

- 支持设置小程序上传目录
- 支持扫码预览小程序
- 支持小程序打包并上传到微信后台
- 支持查看小程序编译产物
- 支持下载最近上传的 SourceMap

### 代码分析

- 支持代码静态依赖分析
- 支持代码质量分析

### 项目设置

- 支持查看和修改项目配置
- 支持构建 npm
- 支持查看开发文档
- 支持打开微信开发者工具 IDE

### 主题

- 提供 `Dark` 和 `Light` 两种主题
- 提供图标

### 组件支持

- 支持点击自定义组件标签跳转到对应文件
- 支持点击绑定的函数名跳转到对应函数定义

### 其它

- 支持微信小程序开发文档搜索
- 支持代理设置

## 常见问题

1. IDE 默认会寻找项目根目录的 `project.config.json`。若小程序项目有单独的目录，将无法自动识别，需按照提示选择该文件进行设置。设置完成后会在项目目录下生成 `.vscode/settings.json` 用于存储。

1. 在 **微信公众平台** - **开发** - **开发设置** 下载代码上传密钥后，一定要关闭 **IP 白名单** 功能，否则无法正常预览和上传小程序。如果你的设备是静态 IP，也可以在白名单中配置设备 IP 使用（不推荐）。

## 反馈

> 精力有限，Issue 和 Pull Request 会定期处理

[创建 Issue](https://github.com/crazyurus/miniprogram-vscode-extension/issues)

[欢迎 Pull Request](https://github.com/crazyurus/miniprogram-vscode-extension/pulls)

[Email: crazyurus@vip.qq.com](mailto:crazyurus@vip.qq.com)

## 致谢

感谢以下开源项目：

- [minapp-vscode](https://github.com/wx-minapp/minapp-vscode)

- [vscode-miniapp-helper](https://github.com/overtrue/vscode-miniapp-helper)

- [w-extension](https://github.com/masterZSH/w-extension)

- [@tarojs/plugin-mini-ci](https://github.com/NervJS/taro/blob/next/packages/taro-plugin-mini-ci)

- [minapp-comp-definition](https://github.com/wjf2016/minapp-comp-definition)

部分功能的实现参考了微信开发者工具 IDE

## License

[GPL-3.0](https://github.com/crazyurus/miniprogram-vscode-extension/blob/master/LICENSE)
