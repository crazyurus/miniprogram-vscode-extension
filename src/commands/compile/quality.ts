import * as ci from 'miniprogram-ci';
import * as vscode from 'vscode';

import { createProject } from '../../utils/project';
import renderHTML from '../../utils/render';
import { openWebView } from '../../utils/ui';
import Command from '../base';

class QualityCommand extends Command {
  activate(context: vscode.ExtensionContext): void {
    this.register('MiniProgram.commands.compile.quality', async () => {
      const options = await createProject(context);
      const project = new ci.Project(options);
      const result = await ci.checkCodeQuality(project);

      openWebView(
        await renderHTML('quality', {
          items: result
        }),
        '代码质量',
        vscode.ViewColumn.Active
      );
    });
  }
}

export default new QualityCommand();
