import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket as WSWebSocket } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001; // Use 3001 for proxy to avoid conflicting with Vite on 3000

const server = createServer(app);
const wss = new WebSocketServer({ server });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Warning: GEMINI_API_KEY is not set in environment.");
}

wss.on('connection', (clientWs, req) => {
  console.log('Client connected to proxy:', req.url);

  // Construct the target URL for Gemini.
  const targetUrl = `wss://generativelanguage.googleapis.com${req.url?.replace(/key=[^&]*/, `key=${GEMINI_API_KEY}`).replace('//ws', '/ws')}`;
  console.log('Proxying to target URL:', targetUrl);

  const geminiWs = new WSWebSocket(targetUrl);


  geminiWs.on('message', (data) => {
    if (clientWs.readyState === WSWebSocket.OPEN) {
      clientWs.send(data);
    }
  });

  geminiWs.on('close', (code, reason) => {
    console.log('Gemini WebSocket closed:', code, reason.toString());
    if (clientWs.readyState === WSWebSocket.OPEN) {
      clientWs.close(code, reason);
    }
  });

  geminiWs.on('error', (err) => {
    console.error('Gemini WebSocket error:', err);
    if (clientWs.readyState === WSWebSocket.OPEN) {
      clientWs.close();
    }
  });

  const messageQueue: any[] = [];

  clientWs.on('message', (data) => {
    if (geminiWs.readyState === WSWebSocket.OPEN) {
      geminiWs.send(data);
    } else if (geminiWs.readyState === WSWebSocket.CONNECTING) {
      messageQueue.push(data);
    } else {
      console.warn("Received message from client but Gemini WS is closed.");
    }
  });

  geminiWs.on('open', () => {
    console.log('Connected to Gemini WebSocket');
    while (messageQueue.length > 0) {
      const msg = messageQueue.shift();
      geminiWs.send(msg);
    }
  });

  clientWs.on('close', (code, reason) => {
    console.log('Client disconnected from proxy:', code, reason.toString());
    if (geminiWs.readyState === WSWebSocket.OPEN) {
      geminiWs.close(code, reason);
    }
  });

  clientWs.on('error', (err) => {
    console.error('Client WebSocket error:', err);
    if (geminiWs.readyState === WSWebSocket.OPEN) {
      geminiWs.close();
    }
  });
});

server.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
