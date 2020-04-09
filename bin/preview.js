const ci = require('miniprogram-ci');
const params = process.argv;

const project = new ci.Project({
  appid: params[2],
  type: params[3],
  projectPath: params[4],
  privateKeyPath: params[5],
  ignores: ['node_modules/**/*'],
});

ci.preview({
  project,
  desc: '来自 VSCode MiniProgram Extension',
  setting: {
    es7: true,
  },
  qrcodeFormat: 'base64',
  qrcodeOutputDest: params[6],
})
.catch(error => {});
