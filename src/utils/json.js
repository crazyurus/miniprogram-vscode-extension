const fs = require('fs');

function readJSON(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function updateJSON(filePath, key, value, method = '') {
  const appConfig = readJSON(filePath);

  if (method) {
    appConfig[key][method](value);
  } else {
    appConfig[key] = value;
  }

  fs.writeFileSync(filePath, JSON.stringify(appConfig, null, 2));
}

module.exports = {
  readJSON,
  updateJSON,
};