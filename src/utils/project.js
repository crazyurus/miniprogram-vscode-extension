const fs = require('fs');
const path = require('path');
const { readJSON } = require('./json');
const { getCurrentFolderPath } = require('./path');

function readProjectConfig() {
  const rootPath = getCurrentFolderPath();
  const projectFilePath = rootPath + path.sep + 'project.config.json';

  if (fs.existsSync(projectFilePath)) {
    return readJSON(projectFilePath);
  }

  return null;
}

exports.readProjectConfig = readProjectConfig;
