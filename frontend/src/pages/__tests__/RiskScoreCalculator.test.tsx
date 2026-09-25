import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RiskScoreCalculator } from '../RiskScoreCalculator';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/core/api/hooks/usePredict', () => ({
  usePredictSingle: () => ({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    data: null,
  }),
  useRandomTransaction: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@/core/api/hooks/useExplainability', () => ({
  useTransactionExplanation: () => ({
    data: null,
    isLoading: false,
  }),
}));

const queryClient = new QueryClient();

describe('RiskScoreCalculator Form Validation', () => {
  it('displays validation errors for empty/invalid fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RiskScoreCalculator />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const txInput = screen.getByLabelText(/Transaction ID/i);
    fireEvent.change(txInput, { target: { value: '' } });

    const submitBtn = screen.getByRole('button', { name: /Run Fraud Detection/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Enter a valid numeric/i)).toBeInTheDocument();
  });

  it('allows valid submission', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RiskScoreCalculator />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const txInput = screen.getByLabelText(/Transaction ID/i);

    fireEvent.change(txInput, { target: { value: '10492' } });

    const submitBtn = screen.getByRole('button', { name: /Run Fraud Detection/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByText('Enter a valid numeric ID')).not.toBeInTheDocument();
    });
  });
});
