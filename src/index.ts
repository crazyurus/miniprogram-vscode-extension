import Module from './base';
import CommandModule from './commands';
import ViewPlugin from './plugins/view';
import ExtensionPlugin from './plugins/extension';
import TypeScriptPlugin from './plugins/typescript';
import ProxyPlugin from './plugins/proxy';
import ComponentPlugin from './plugins/component';

class EntryModule extends Module {
  dependencies = [
    ViewPlugin,
    CommandModule,
    ExtensionPlugin,
    TypeScriptPlugin,
    ProxyPlugin,
    ComponentPlugin
  ];
}

const entry = new EntryModule();

export const activate = entry.activate.bind(entry);
export const deactivate = entry.deactivate.bind(entry);
