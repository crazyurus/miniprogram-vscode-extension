function createProject(params) {
  return {
    appid: params[2],
    type: params[3],
    projectPath: params[4],
    privateKeyPath: params[5],
    ignores: ['node_modules/**/*'],
  };
}

exports.createProject = createProject;