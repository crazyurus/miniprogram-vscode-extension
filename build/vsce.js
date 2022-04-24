const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '..', 'package.json');
const packageConfig = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

packageConfig.main = './dist/extension/index.js';

fs.writeFileSync(packagePath, JSON.stringify(packageConfig, null, 2));