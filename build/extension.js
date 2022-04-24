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
    'commands.config.openIDE': 'Open WeChat developer tools',
    'commands.config.project': 'View project configuration',
    'commands.compile.npm': 'Build NPM',
    'commands.compile.analyse': 'Analyze code static dependencies',
    'commands.compile.artifact': 'View mini program artifact',
    'commands.compile.preview': 'Preview mini program',
    'commands.compile.upload': 'Package and upload mini program',
    'commands.document': 'View development documentation',
    'commands.stroage.clear': 'Clear cache',
    "commands.management": "Open WeChat management platform"
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
