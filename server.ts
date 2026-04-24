import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set in environment variables');
}

wss.on('connection', (ws) => {
  console.log('Client connected to proxy');

  if (!GEMINI_API_KEY) {
    console.error('Cannot connect to Gemini: API Key missing');
    ws.close(1011, 'API Key missing on server');
    return;
  }

  const targetUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BiDiSession?key=${GEMINI_API_KEY}`;
  const targetWs = new WebSocket(targetUrl);

  targetWs.on('open', () => {
    console.log('Connected to Gemini API');
  });

  ws.on('message', (message) => {
    if (targetWs.readyState === WebSocket.OPEN) {
      targetWs.send(message);
    }
  });

  targetWs.on('message', (message) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });

  ws.on('close', () => {
    targetWs.close();
    console.log('Client disconnected');
  });

  targetWs.on('close', () => {
    ws.close();
    console.log('Gemini API disconnected');
  });

  targetWs.on('error', (error) => {
    console.error('Target WS Error:', error);
    ws.close();
  });

  ws.on('error', (error) => {
    console.error('Client WS Error:', error);
    targetWs.close();
  });
});

app.get('/health', (req, res) => {
  res.send('Proxy is running');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
