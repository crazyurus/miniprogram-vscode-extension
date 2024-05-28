import { debounce } from 'debounce';
import { fetch } from 'undici';
import * as vscode from 'vscode';

import Command from '../base';
import { createServer } from './utils';

interface SearchResult {
  label: string;
  url: string;
  detail: string;
}

async function getSearchResult(query: string): Promise<SearchResult[]> {
  const response = await fetch(
    `https://developers.weixin.qq.com/search?action=wxa_search&size=50&query=${query}&page=1&language=1&type=wxadoc&doc_type=miniprogram`
  );
  const result = (await response.json()) as any;

  return result.doc_item_list.item_list.map((item: any) => ({
    label: item.title,
    url: item.url,
    detail: item.content
  }));
}

class SearchDocumentCommand extends Command {
  activate(): void {
    this.register('MiniProgram.commands.document.search', async () => {
      const picker = vscode.window.createQuickPick<SearchResult>();
      picker.placeholder = '支持 API、服务端、架构文档内容搜索';
      picker.matchOnDescription = true;
      picker.matchOnDetail = true;
      picker.onDidChangeValue(
        debounce(async (value: string) => {
          if (value.length > 0) {
            picker.items = await getSearchResult(value);
          } else {
            picker.items = [];
          }
        }, 500)
      );
      picker.onDidChangeSelection(items => {
        createServer(items[0].url, items[0].label);
      });

      picker.show();
    });
  }
}

export default new SearchDocumentCommand();
