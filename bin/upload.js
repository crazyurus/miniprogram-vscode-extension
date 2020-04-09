const ci = require('miniprogram-ci');
const { createProject } = require('./base');
const params = process.argv;
const options = createProject(params);

const project = new ci.Project(options);

ci.upload({
  project,
  version: params[6],
  desc: params[7],
  setting: {
    es7: true,
  },
}).catch(error => {});
