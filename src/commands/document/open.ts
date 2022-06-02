import Command from '../base';
import { createServer } from './utils';

class OpenDocumentCommand extends Command {
  activate(): void {
    this.register('MiniProgram.commands.document.open', () => {
      createServer('https://developers.weixin.qq.com/miniprogram/dev/framework/', '微信开发文档');
    });
  }
}

export default new OpenDocumentCommand();
