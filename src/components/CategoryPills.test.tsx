import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryPills } from './CategoryPills';

const cats = [
  { id: 'palitos-agua', name: 'Palitos de Agua', icon: '🧊' },
  { id: 'potes-familiares', name: 'Potes Familiares', icon: '🪣' },
];

describe('CategoryPills', () => {
  it('renders a pill per category and reports selection', async () => {
    const onSelect = vi.fn();
    render(<CategoryPills categories={cats} selected={null} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Potes Familiares/i }));
    expect(onSelect).toHaveBeenCalledWith('potes-familiares');
  });

  it('toggles off when the active pill is clicked again', async () => {
    const onSelect = vi.fn();
    render(<CategoryPills categories={cats} selected="potes-familiares" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Potes Familiares/i }));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
