import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from '../../pages/About';

describe('Home コンポーネント', () => {
  it('タイトルと説明文が表示される', () => {
    render(<About />);

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();

    expect(screen.getByText('これはAbout画面です。')).toBeInTheDocument();
  });
});
