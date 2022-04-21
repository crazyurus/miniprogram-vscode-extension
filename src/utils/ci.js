let task;
function loadMiniprogramCI() {
  if (task) {
    return task;
  }

  task = new Promise(resolve => {
    const ci = require('miniprogram-ci');
    resolve(ci);
  });

  return task;
}

module.exports = {
  loadMiniprogramCI,
};
