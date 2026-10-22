import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock ResponsiveContainer from recharts
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

// Mock framer-motion/motion to avoid animation errors in tests
vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => {
        // Strip out motion props to avoid React warnings about invalid DOM attributes
        const { animate, initial, exit, transition, variants, whileHover, whileTap, layoutId, ...validProps } = props;
        return <div {...validProps}>{children}</div>;
      },
      button: ({ children, ...props }: any) => {
        const { animate, initial, exit, transition, variants, whileHover, whileTap, layoutId, ...validProps } = props;
        return <button {...validProps}>{children}</button>;
      },
      span: ({ children, ...props }: any) => {
        const { animate, initial, exit, transition, variants, whileHover, whileTap, layoutId, ...validProps } = props;
        return <span {...validProps}>{children}</span>;
      }
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
  };
});
