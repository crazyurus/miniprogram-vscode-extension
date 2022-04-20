const fs = require('fs');
const path = require('path');
const { readJSON } = require('./json');
const { getCurrentFolderPath } = require('./path');

function readProjectConfig() {
  const rootPath = getCurrentFolderPath();
  const projectFilePath = path.join(rootPath, 'project.config.json');

  if (fs.existsSync(projectFilePath)) {
    const config = readJSON(projectFilePath);

    config.projectname = decodeURIComponent(config.projectname);

    return config;
  }

  return null;
}

exports.readProjectConfig = readProjectConfig;
