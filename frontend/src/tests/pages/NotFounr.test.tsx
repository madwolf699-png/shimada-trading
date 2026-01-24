import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFound from '../../pages/NotFound';

describe('NotFound コンポーネント', () => {
  it('404エラーメッセージが表示される', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { name: '404 Not Found' })).toBeInTheDocument();

    expect(screen.getByText('お探しのページは存在しません。')).toBeInTheDocument();
  });
});
