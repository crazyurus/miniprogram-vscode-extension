function template(params) {
  with (params) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              line-height: 1.5;
            }
            .title {
              cursor: default;
              text-align: center;
              font-size: 20px;
              margin-top: 30px;
            }
            .qrcode {
              display: block;
              width: 280px;
              margin: 15px auto;
              border: 1px solid #E2E2E2;
            }
            body.vscode-dark .footer {
              background-color: #232323;
              box-shadow: inset 0 5px 10px -5px #191919, 0 1px 0 0 #444;
            }
            .footer {
              cursor: default;
              box-sizing: border-box;
              width: 280px;
              margin: 0 auto;
              border-radius: 100px;
              font-size: 13px;
              text-align: center;
              padding: 7px 14px;
            }
          </style>
        </head>
        <body>
          <div class="title">微信小程序预览</div>
          <img class="qrcode" src="${base64}">
          <div class="footer">
            <div>请使用微信扫描二维码预览</div>
            <div>“${appName}”</div>
          </div>
        </body>
      </html>
    `;
  }
}

module.exports = template;
