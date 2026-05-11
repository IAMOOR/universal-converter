import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('Calculator Input Tests', () => {
  it('should input numbers correctly in calculator', async () => {
    render(<App />);

    // Open calculator
    const calcButton = screen.getByTitle('Calculator');
    fireEvent.click(calcButton);

    // Wait for animation and mount of calculator buttons
    await waitFor(() => {
      expect(screen.getByText('AC')).toBeTruthy();
    });

    const acBtn = screen.getByText('AC');
    const btn1 = screen.getByText('1');
    const btn2 = screen.getByText('2');
    const dotBtn = screen.getByText('.');
    const btn5 = screen.getByText('5');

    // Display will have '0' initial text
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);

    // Click 1
    fireEvent.click(btn1);
    expect(screen.queryAllByText('1').length).toBeGreaterThan(0);

    // Click 2
    fireEvent.click(btn2);
    expect(screen.queryAllByText('12').length).toBeGreaterThan(0);

    // Test the inputDigit function logic (dot)
    fireEvent.click(dotBtn);
    fireEvent.click(btn5);
    expect(screen.queryAllByText('12.5').length).toBeGreaterThan(0);

    // Test clear
    fireEvent.click(acBtn);
    expect(screen.queryAllByText('0').length).toBeGreaterThan(0);
  });
});
