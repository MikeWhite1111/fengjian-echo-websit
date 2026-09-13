// 独立本地静态服务：仅监听本机，不依赖 ChatGPT 进程或外部网络。
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/client/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.json': 'application/json', '.mp4': 'video/mp4' };
const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.url === '/__fengjian_health') {
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ app: 'fengjian-preview', root, pid: process.pid }));
  }
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const path = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!path.startsWith(resolve(root) + sep)) { res.writeHead(403); return res.end(); }
    const info = await stat(path);
    if (!info.isFile()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Content-Length': info.size });
    if (req.method === 'HEAD') return res.end();
    createReadStream(path).on('error', () => res.destroy()).pipe(res);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? 'Port 4174 is occupied; refusing to switch ports.' : error); process.exit(1); });
server.listen(4174, '127.0.0.1', () => console.log('Fengjian preview http://127.0.0.1:4174/#home'));
