import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// --- モック ---
const renderMock = vi.fn();

vi.mock('react-dom/client', async () => {
  return {
    default: {
      createRoot: vi.fn(() => ({
        render: renderMock,
      })),
    },
  };
});

vi.mock('../App.tsx', () => ({
  default: () => <div>Mock App</div>,
}));

describe('../main.tsx', () => {
  beforeEach(() => {
    renderMock.mockClear();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('ReactDOM.createRoot が呼ばれ、App が BrowserRouter 配下で render される', async () => {
    await import('../main');

    expect(renderMock).toHaveBeenCalledTimes(1);

    const renderedElement = renderMock.mock.calls[0][0];

    expect(renderedElement.type).toBe(BrowserRouter);
  });
});
