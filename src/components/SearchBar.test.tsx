import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

function Harness() {
  const [value, setValue] = useState('');
  return <SearchBar value={value} onChange={setValue} />;
}

describe('SearchBar', () => {
  it('reflects the typed query', async () => {
    render(<Harness />);
    const input = screen.getByPlaceholderText(/Buscar/i);
    await userEvent.type(input, 'frut');
    expect(input).toHaveValue('frut');
  });
});
