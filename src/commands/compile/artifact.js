const vscode = require('vscode');
const os = require('os');
const path = require('path');
const open = require('open');
const { readProjectConfig, createProject } = require('../../utils/project');
const { getCompileOptions, getTemporaryFileName, registerCommand } = require('./utils');

function artifact(context) {
  registerCommand('MiniProgram.commands.compile.artifact', async () => {
    const projectConfig = readProjectConfig();

    if (!projectConfig) {
      throw new Error('未找到 project.config.json 文件');
    }

    const options = await createProject(context);
    const artifactZipPath = path.join(os.tmpdir(), getTemporaryFileName('artifact', options.appid, 'zip'));
    await vscode.window.withProgress({
      title: '正在编译小程序',
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
    }, async progress => {
      const ci = require('miniprogram-ci');
      const project = new ci.Project(options);

      await ci.getCompiledResult({
        project,
        version: '1.0.0',
        setting: getCompileOptions(projectConfig.setting),
        onProgressUpdate(message) {
          progress.report(message);
        },
      }, artifactZipPath);
      
      open(artifactZipPath);
    });
  });
}

module.exports = artifact;
