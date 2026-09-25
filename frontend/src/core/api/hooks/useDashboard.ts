import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/dashboard/stats');
      return data.data;
    },
    // Keep data fresh every minute
    staleTime: 60000,
    refetchInterval: 60000,
  });
};
