import * as vscode from 'vscode';
import * as path from 'path';
import Plugin from '../base';
import { readJSON } from '../utils/json';
import { getCurrentFolderPath } from '../utils/path';
import { readAppConfig } from '../utils/project';

const wxTags = [
  'movable-view',
  'cover-image',
  'cover-view',
  'movable-area',
  'scroll-view',
  'swiper',
  'swiper-item',
  'view',
  'icon',
  'progress',
  'rich-text',
  'text',
  'button',
  'checkbox',
  'checkbox-group',
  'editor',
  'form',
  'input',
  'label',
  'picker',
  'picker-view',
  'picker-view-column',
  'radio',
  'radio-group',
  'slider',
  'switch',
  'textarea',
  'functional-page-navigator',
  'navigator',
  'audio',
  'camera',
  'image',
  'live-player',
  'live-pusher',
  'video',
  'map',
  'canvas',
  'ad',
  'official-account',
  'open-data',
  'web-view',
];

class ComponentPlugin extends Plugin {
  async activate(context: vscode.ExtensionContext): Promise<void> {
    context.subscriptions.push(
      vscode.languages.registerDefinitionProvider(
        [
          {
            scheme: 'file',
            language: 'wxml',
            pattern: '**/*.wxml',
          },
        ],
        {
          provideDefinition(
            doc: vscode.TextDocument,
            position: vscode.Position
          ) {
            const lineText = doc.lineAt(position).text;
            const wordRange = doc.getWordRangeAtPosition(
              position,
              /[\w|\-]+\b/
            );
            const tag = (lineText.match(/(?<=<\/?)[\w|\-]+\b/) || [])[0];
            const word = doc.getText(wordRange);

            if (!tag) {
              return;
            }

            if (tag !== word) {
              return;
            }

            if (wxTags.includes(tag)) {
              return [];
            }

            const filePath = doc.fileName;
            const rootPath = getCurrentFolderPath();
            const jsonFile = filePath.replace('.wxml', '.json');
            let config = readJSON(jsonFile)!;
            let componentPath;

            if (config.usingComponents && config.usingComponents[tag]) {
              componentPath = config.usingComponents[tag];
            }

            if (!componentPath) {
              config = readAppConfig(rootPath)!;

              if (config.usingComponents && config.usingComponents[tag]) {
                componentPath = config.usingComponents[tag];
              }
            }

            componentPath = componentPath.replace('/', path.sep);

            const result = path.join(filePath, '..', `${componentPath}.js`);

            return new vscode.Location(
              vscode.Uri.file(result),
              new vscode.Position(0, 0)
            );
          },
        }
      )
    );
  }
}

export default new ComponentPlugin();
