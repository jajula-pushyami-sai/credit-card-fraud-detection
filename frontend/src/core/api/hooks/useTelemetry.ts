import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

export const useKPIs = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['telemetry_kpi'],
    queryFn: async () => {
      const { data } = await apiClient.get('/telemetry/kpi');
      return data.data;
    },
    staleTime: 30000,
    refetchInterval: 30000, // Live polling every 30 seconds
    enabled,
  });
};

export const useTrends = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['telemetry_trends'],
    queryFn: async () => {
      const { data } = await apiClient.get('/telemetry/trends');
      return data.data;
    },
    staleTime: 60000,
    refetchInterval: 60000,
    enabled,
  });
};

export const useSystemHealth = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['telemetry_health'],
    queryFn: async () => {
      const { data } = await apiClient.get('/telemetry/health');
      return data.data;
    },
    staleTime: 15000,
    refetchInterval: 15000, // High frequency for gauges
    enabled,
  });
};
