import test from 'node:test';
import assert from 'node:assert';
import { renderToString } from 'react-dom/server';
import App from './App.tsx';

test('App renders without crashing', () => {
  const html = renderToString(<App />);
  assert.ok(html.includes('Universal Metric Converter &amp; Calculator'));
});
