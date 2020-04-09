function exec(commands) {
  const { exec } = require('child_process');

  return new Promise((resolve, reject) => {
    exec(commands.join(' '), (error, stdout, stderr) => {
      if (stderr) {
        let errMsg = stderr;
  
        if (stderr.includes('{')) {
          let json = stderr.slice(stderr.indexOf('{'));
  
          try {
            json = JSON.parse(json);
            errMsg = json.errMsg;
  
            if (errMsg.includes('invalid ip:')) {
              errMsg = '请前往微信小程序后台“开发”-“开发设置”关闭 IP 白名单\n' + errMsg;
            }
          } catch {
            reject(errMsg);
          }
        }
  
        reject(errMsg);
      } else {
        resolve();
      }
    });
  });
}

exports.exec = exec;