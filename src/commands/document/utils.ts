import * as http from 'http';
import { fetch } from 'undici';
import { openURL } from '../../utils/ui';

export function createServer(url: string, title: string): void {
  const baseURL = 'https://developers.weixin.qq.com';
  const server = http.createServer(async (request, response) => {
    const result = await fetch(baseURL + request.url);
    let content = await result.text();

    response.writeHead(result.status, {});
    content = content.replace('<body>', '<body style="background-color: #fff">');
    response.end(content);
  });
  server.listen();

  server.on('listening', async () => {
    const address = server.address() as { port: number };

    if (address) {
      const webviewURL = url.replace(baseURL, `http://localhost:${address.port}`);
      const webview = await openURL(webviewURL, title);

      webview.onDidDispose(() => {
        server.close();
      });
    }
  });
}
