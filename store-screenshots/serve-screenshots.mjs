import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 4177);

const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.png', 'image/png'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
]);

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);
    const pathname = url.pathname === '/' ? '/store-screenshots/screenshot-deck.html' : url.pathname;
    const target = normalize(join(root, decodeURIComponent(pathname)));
    if (!target.startsWith(root)) throw new Error('Invalid path');
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': types.get(extname(target)) || 'application/octet-stream' });
    res.end(body);
  } catch (_error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Screenshot server running at http://127.0.0.1:${port}`);
});
