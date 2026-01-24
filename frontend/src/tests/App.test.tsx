import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// 各ページを簡易モック
vi.mock('../pages/Home.tsx', () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock('../pages/About.tsx', () => ({
  default: () => <div>About Page</div>,
}));

vi.mock('../pages/NotFound.tsx', () => ({
  default: () => <div>Not Found Page</div>,
}));

describe('App Routing', () => {
  it('"/" にアクセスすると Home が表示される', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('"/home" にアクセスすると "/" にリダイレクトされ Home が表示される', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('"/about" にアクセスすると About が表示される', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('About Page')).toBeInTheDocument();
  });

  it('存在しないパスでは NotFound が表示される', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Not Found Page')).toBeInTheDocument();
  });
});
