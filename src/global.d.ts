interface Window {
  webkitAudioContext: typeof AudioContext;
  _voiceCleanup?: () => void;
}
