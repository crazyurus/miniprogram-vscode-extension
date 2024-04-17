import * as vscode from 'vscode';

import Command from '../base';

import { createProject } from '../../utils/project';
import { openWebView } from '../../utils/ui';
import renderHTML from '../../utils/render';

class QualityCommand extends Command {
  activate(context: vscode.ExtensionContext): void {
    this.register('MiniProgram.commands.compile.quality', async () => {
      const ci = await import('miniprogram-ci');
      const options = await createProject(context);
      const project = new ci.Project(options);
      const result = await ci.checkCodeQuality(project);

      openWebView(
        await renderHTML('quality', {
          items: result,
        }),
        '代码质量',
        vscode.ViewColumn.Active
      );
    });
  }
}

export default new QualityCommand();
