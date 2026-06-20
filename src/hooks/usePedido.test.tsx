import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePedido } from './usePedido';

beforeEach(() => localStorage.clear());

describe('usePedido', () => {
  it('adds, increments count, and removes lines', () => {
    const { result } = renderHook(() => usePedido());
    act(() => result.current.add({ id: 'a', name: 'Summun', modo: 'caja', precio: 12000 }));
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.count).toBe(1);
    act(() => result.current.add({ id: 'a', name: 'Summun', modo: 'caja', precio: 12000 }));
    expect(result.current.lines[0].cantidad).toBe(2);
    expect(result.current.count).toBe(2);
    act(() => result.current.remove('a', 'caja'));
    expect(result.current.lines).toHaveLength(0);
  });

  it('keeps unidad and caja of the same product as separate lines', () => {
    const { result } = renderHook(() => usePedido());
    act(() => result.current.add({ id: 'a', name: 'Summun', modo: 'unidad', precio: 800 }));
    act(() => result.current.add({ id: 'a', name: 'Summun', modo: 'caja', precio: 12000 }));
    expect(result.current.lines).toHaveLength(2);
  });
});
