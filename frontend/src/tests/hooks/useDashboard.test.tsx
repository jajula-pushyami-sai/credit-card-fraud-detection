/**
 * Tests for useDashboardStats hook.
 * Uses vi.hoisted to avoid temporal dead zone with vi.mock hoisting.
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

import { useDashboardStats } from '@/core/api/hooks/useDashboard';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useDashboardStats', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns loading state initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns real data on success', async () => {
    const mockStats = { total_transactions: 1024, fraud_prevented: 150, system_status: 'Online' };
    mockGet.mockResolvedValue({ data: { data: mockStats } });

    const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockStats);
    expect(result.current.data?.total_transactions).toBe(1024);
  });

  it('sets isError on API failure', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
