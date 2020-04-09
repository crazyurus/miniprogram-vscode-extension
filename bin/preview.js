const ci = require('miniprogram-ci');
const { createProject } = require('./base');
const params = process.argv;
const options = createProject(params);

const project = new ci.Project(options);

ci.preview({
  project,
  desc: '来自 VSCode MiniProgram Extension',
  setting: {
    es7: true,
  },
  qrcodeFormat: 'base64',
  qrcodeOutputDest: params[6],
}).catch(error => {});
