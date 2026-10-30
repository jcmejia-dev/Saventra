import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!['index.html', 'styles.css', 'app.js', 'finance.js'].includes(file)) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', `${types[path.extname(file)]}; charset=utf-8`);
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
