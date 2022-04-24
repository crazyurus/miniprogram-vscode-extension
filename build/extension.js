const fs = require('fs');
const path = require('path');
const glob = require('glob');
const lodash = require('lodash');

function customizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

glob('../extensions/*/package.json', {
  cwd: __dirname,
}, (error, files) => {
  if (error) {
    console.error(error);
    return;
  }

  const config = require('../package.json');
  const base = require('../contributes.json');
  const entry = [];

  files.forEach(file => {
    const { contributes, main } = require(file);

    lodash.mergeWith(base, contributes, customizer);

    if (main) {
      entry.push(path.join(file, '..', main));
    }
  });

  fs.writeFileSync('./package.json', JSON.stringify({
    ...config,
    contributes: base,
  }, null, 2));
  fs.writeFileSync('./extensions.json', JSON.stringify(entry));
});

glob('../extensions/*/package.nls.json', {
  cwd: __dirname,
}, (error, files) => {
  if (error) {
    console.error(error);
    return;
  }

  const nls = {
    'commands.config.openIDE': 'Open WeChat Developer Tools',
    'commands.config.project': 'View Project Configuration',
    'commands.compile.npm': 'Build NPM',
    'commands.compile.analyse': 'Analyze Code Static Dependencies',
    'commands.compile.artifact': 'View MiniProgram Artifact',
    'commands.compile.sourceMap': 'Download the SourceMap of the Most Recently Uploaded Version',
    'commands.compile.preview': 'Preview MiniProgram',
    'commands.compile.upload': 'Package and Upload MiniProgram',
    'commands.document': 'View Development Documentation',
    'commands.stroage.clear': 'Clear Cache',
    "commands.management": "Open WeChat Management Platform"
  };

  files.forEach(file => {
    const content = require(file);

    Object.assign(nls, content);
  });

  fs.writeFileSync('./package.nls.json', JSON.stringify({
    ...nls,
    displayName: 'MiniProgram Extension',
    description: 'Provide preview, package upload, code completion, syntax highlighting, project templates and other functions for mini program',
  }, null, 2));
});
