import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('logs an error when fetching exchange rates fails', async () => {
    // Mock fetch to reject
    const mockFetch = vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('https://open.er-api.com/v6/latest/USD');
    });

    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalledWith('Failed to fetch exchange rates:', expect.any(Error));
    });
  });
});
