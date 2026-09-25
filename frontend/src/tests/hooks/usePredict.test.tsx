/**
 * Tests for usePredictSingle mutation.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock('@/core/api/client', () => ({
  apiClient: {
    get:  vi.fn(),
    post: mockPost,
    put:  vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    defaults: { baseURL: 'http://localhost:5000/api/v1' },
  },
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: { getState: () => ({ logout: vi.fn() }) },
}));

import { usePredictSingle } from '@/core/api/hooks/usePredict';

const highRiskResult = {
  data: {
    transaction_id: 42,
    risk_assessment: {
      probability: 0.87,
      risk_level: 'High Risk',
      suggested_action: 'decline',
      base_models: { extra_trees: 0.89, mlp: 0.84 },
    },
  },
};

const lowRiskResult = {
  data: {
    transaction_id: 43,
    risk_assessment: {
      probability: 0.03,
      risk_level: 'Low Risk',
      suggested_action: 'approve',
      base_models: { extra_trees: 0.02, mlp: 0.04 },
    },
  },
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('usePredictSingle', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('starts in idle state', () => {
    const { result } = renderHook(() => usePredictSingle(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('returns high-risk result for large crypto transaction', async () => {
    mockPost.mockResolvedValue({ data: highRiskResult });
    const { result } = renderHook(() => usePredictSingle(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ Amount: 9000, Merchant: 'Binance', Category: 'Crypto Exchange' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const ra = result.current.data?.data?.risk_assessment;
    expect(ra?.probability).toBeGreaterThan(0.5);
    expect(ra?.risk_level).toBe('High Risk');
    expect(ra?.suggested_action).toBe('decline');
  });

  it('returns low-risk result for small grocery transaction', async () => {
    mockPost.mockResolvedValue({ data: lowRiskResult });
    const { result } = renderHook(() => usePredictSingle(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ Amount: 5.49, Merchant: 'Whole Foods', Category: 'Grocery' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const ra = result.current.data?.data?.risk_assessment;
    expect(ra?.probability).toBeLessThan(0.15);
    expect(ra?.suggested_action).toBe('approve');
  });

  it('sets isError on network failure', async () => {
    mockPost.mockRejectedValue(new Error('503 Service Unavailable'));
    const { result } = renderHook(() => usePredictSingle(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ Amount: 100, Merchant: 'Test', Category: 'General' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
