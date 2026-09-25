import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePredictSingle } from '../usePredict';
import { apiClient } from '../../client';
import React, { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePredict hook', () => {
  it('should successfully post prediction data and return response', async () => {
    const mockResponse = { data: { prediction: 1, risk_score: 85 } };
    (apiClient.post as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePredictSingle(), { wrapper });

    result.current.mutate({ Amount: 100, Merchant: 'Test', Category: 'Retail' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse.data);
    expect(apiClient.post).toHaveBeenCalledWith('/fraud/predict', {
      Amount: 100,
      Merchant: 'Test',
      Category: 'Retail',
    });
  });
});
