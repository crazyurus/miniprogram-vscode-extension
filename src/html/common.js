function template(params) {
  with (params) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body, iframe {
              height: 100%;
              width: 100%;
              border: none;
              padding: 0;
              ${style}
            }
          </style>
        </head>
        <body>
          <iframe src="${url}">
        </body>
      </html>
    `;
  }
}

module.exports = template;
