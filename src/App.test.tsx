import { render, waitFor } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles fetch error gracefully in fetchRates', async () => {
    // Mock global fetch to throw an error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch exchange rates:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
