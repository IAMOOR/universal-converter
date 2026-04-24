import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
}
