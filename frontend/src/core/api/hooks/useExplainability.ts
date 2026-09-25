import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

export const useTransactionExplanation = (txId: string | null) => {
  return useQuery({
    queryKey: ['explanation', txId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/explainability/transaction/${txId}`);
      return data.data;
    },
    enabled: !!txId, // Only fetch if an ID is provided
  });
};

export const useGlobalInsights = () => {
  return useQuery({
    queryKey: ['global_insights'],
    queryFn: async () => {
      const { data } = await apiClient.get('/explainability/global');
      return data.data;
    },
  });
};

export const useModelComparison = () => {
  return useQuery({
    queryKey: ['model_comparison'],
    queryFn: async () => {
      const { data } = await apiClient.get('/explainability/compare');
      return data.data;
    },
  });
};
