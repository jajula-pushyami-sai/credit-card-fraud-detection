/**
 * Tests for useTransactions hook.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }));

vi.mock('@/core/api/client', () => ({
  apiClient: {
    get:  mockGet,
    post: vi.fn(),
    put:  vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    defaults: { baseURL: 'http://localhost:5000/api/v1' },
  },
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: { getState: () => ({ logout: vi.fn() }) },
}));

import { useTransactions } from '@/core/api/hooks/useTransactions';

const mockPaginatedResponse = {
  items: [
    { id: 1, merchant: 'Amazon',          amount: 49.99,   status: 'approved', date: '2026-07-21T10:00:00Z', risk_score: 0.04 },
    { id: 2, merchant: 'Crypto Exchange', amount: 9000.00, status: 'declined', date: '2026-07-21T11:00:00Z', risk_score: 0.92 },
  ],
  total: 2, pages: 1, current_page: 1,
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useTransactions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('starts in loading state', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useTransactions(1, 20), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns paginated transaction list on success', async () => {
    mockGet.mockResolvedValue({ data: { data: mockPaginatedResponse } });
    const { result } = renderHook(() => useTransactions(1, 20), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(2);
    expect(result.current.data?.total).toBe(2);
    expect(result.current.data?.items[0].merchant).toBe('Amazon');
  });

  it('high-risk transaction has risk_score > 0.5', async () => {
    mockGet.mockResolvedValue({ data: { data: mockPaginatedResponse } });
    const { result } = renderHook(() => useTransactions(1, 20), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const cryptoTx = result.current.data?.items.find((t: any) => t.merchant === 'Crypto Exchange');
    expect(cryptoTx?.risk_score).toBeGreaterThan(0.5);
  });

  it('sets isError when API fails', async () => {
    mockGet.mockRejectedValue(new Error('500 Internal Server Error'));
    const { result } = renderHook(() => useTransactions(1, 20), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
