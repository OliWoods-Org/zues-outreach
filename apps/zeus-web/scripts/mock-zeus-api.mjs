#!/usr/bin/env node
/**
 * Local mock for Relay + Chat backends (no deps).
 *
 *   GET  http://localhost:8788/module      → RelayModuleSnapshot JSON
 *   POST http://localhost:8788/completion  → { content: string }
 *
 * Point the app at one origin:
 *   VITE_ZEUS_RELAY_API_URL=http://localhost:8788
 *   VITE_ZEUS_CHAT_API_URL=http://localhost:8788
 */
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.ZEUS_MOCK_API_PORT ?? 8788);

let relaySnapshot;
try {
  relaySnapshot = JSON.parse(readFileSync(join(__dirname, 'relay-module.snapshot.json'), 'utf8'));
} catch {
  console.error('Missing scripts/relay-module.snapshot.json — run from apps/zeus-web');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json; charset=utf-8' };

  if (req.method === 'GET' && url.pathname === '/module') {
    res.writeHead(200, cors);
    res.end(JSON.stringify(relaySnapshot));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/completion') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      let mode = 'sales';
      let lastUser = '(empty)';
      try {
        const j = JSON.parse(body || '{}');
        mode = j.mode === 'guard' ? 'guard' : 'sales';
        const msgs = Array.isArray(j.messages) ? j.messages : [];
        const users = msgs.filter(m => m.role === 'user');
        const last = users[users.length - 1];
        if (last?.content) lastUser = String(last.content).slice(0, 500);
      } catch {
        /* ignore */
      }
      const content =
        mode === 'guard'
          ? `[mock API] Guard mode echo: ${lastUser}\n\n(This replaces the in-browser stub when VITE_ZEUS_CHAT_API_URL is set.)`
          : `[mock API] Sales mode echo: ${lastUser}\n\n(This replaces the in-browser stub when VITE_ZEUS_CHAT_API_URL is set.)`;
      res.writeHead(200, cors);
      res.end(JSON.stringify({ content }));
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found — use GET /module or POST /completion');
});

server.listen(PORT, () => {
  console.info(`Zeus mock API listening on http://localhost:${PORT}`);
  console.info(`  GET  /module`);
  console.info(`  POST /completion`);
});
