import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../../pages/Home';

describe('Home コンポーネント', () => {
  it('タイトルと説明文が表示される', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();

    expect(screen.getByText('これはホーム画面です。')).toBeInTheDocument();
  });
});
