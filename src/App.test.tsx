import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock global fetch to prevent NetworkErrors in happy-dom during component mount
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rates: { USD: 1, EUR: 0.85 } })
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles invalid JSON in localStorage gracefully', async () => {
    // Mock localStorage
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'converter_pinned_units') {
        return 'invalid json string';
      }
      return null;
    });
    const parseSpy = vi.spyOn(JSON, 'parse');

    // Render the app inside act to handle asynchronous state updates from fetch
    await act(async () => {
      render(<App />);
    });

    // Check if it renders without throwing and caught the error
    expect(screen.getAllByText(/Converter/i).length).toBeGreaterThan(0); // wait for something on screen
    expect(getItemSpy).toHaveBeenCalledWith('converter_pinned_units');
    expect(parseSpy).toHaveBeenCalledWith('invalid json string');

    getItemSpy.mockRestore();
    parseSpy.mockRestore();
  });
});
