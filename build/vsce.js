const fs = require('node:fs');
const path = require('node:path');

const packagePath = path.join(__dirname, '..', 'package.json');
const packageConfig = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

packageConfig.main = './dist/extension/entry.js';

fs.writeFileSync(packagePath, JSON.stringify(packageConfig, null, 2));

const entryPath = path.join(__dirname, '..', 'src', 'entry', 'production.js');
const targetPath = path.resolve(__dirname, '..', packageConfig.main);

fs.copyFileSync(entryPath, targetPath);
