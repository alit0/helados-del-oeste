import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCatalog } from './useCatalog';

beforeEach(() => localStorage.clear());

describe('useCatalog', () => {
  it('starts loading then returns the catalog', async () => {
    const { result } = renderHook(() => useCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data?.categories.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });
});
