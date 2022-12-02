import * as fs from 'fs';
import * as path from 'path';
import { getCurrentFolderPath } from '../utils/path';
import Plugin from '../base';

class TypeScriptPlugin extends Plugin {
  activate(): void {
    const rootPath = getCurrentFolderPath();
    const jsConfigFilePath = path.join(rootPath, 'jsconfig.json');
    const jsConfig = {
      typeAcquisition: {
        include: ['wechat-miniprogram'],
      },
    };

    if (fs.existsSync(jsConfigFilePath)) {
      return;
    }

    fs.promises.writeFile(jsConfigFilePath, JSON.stringify(jsConfig, null, 2));
  }
}

export default new TypeScriptPlugin();
