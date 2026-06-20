import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => localStorage.clear());

describe('App', () => {
  it('loads the catalog and filters by search', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText('Summun Frutilla')).toBeInTheDocument());
    expect(screen.getByRole('heading', { name: /Palitos de Agua/ })).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/Buscar/i), 'almendrado');
    await waitFor(() => expect(screen.getByText('Almendrado')).toBeInTheDocument());
    expect(screen.queryByText('Summun Frutilla')).toBeNull();
  });

  it('adds a product to the order and opens the drawer', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText('Summun Frutilla')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /Agregar Summun Frutilla/i }));
    expect(screen.getByRole('heading', { name: /Mi pedido/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Pedir por WhatsApp/i })).toBeInTheDocument();
  });
});
