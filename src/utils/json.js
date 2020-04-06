const fs = require('fs');

function updateJSON(filePath, key, value, method = '') {
  const content = fs.readFileSync(filePath);
  const appConfig = JSON.parse(content);

  if (method) {
    appConfig[key][method](value);
  } else {
    appConfig[key] = value;
  }

  fs.writeFileSync(filePath, JSON.stringify(appConfig, null, 2));
}

exports.updateJSON = updateJSON;