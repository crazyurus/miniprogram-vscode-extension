const ejs = require('ejs');
const path = require('path');

function render(template, data) {
  return ejs.renderFile(path.join(__dirname, template + '.ejs'), data);
}

module.exports = render;
