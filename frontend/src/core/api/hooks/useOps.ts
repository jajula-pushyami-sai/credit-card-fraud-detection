import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { useEffect, useState } from 'react';

export const useAuditLogs = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['ops_audit'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ops/audit');
      return data.data.logs;
    },
    enabled,
  });
};

export const useSecurityEvents = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['ops_security'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ops/security');
      return data.data;
    },
    enabled,
  });
};

export const useMLOpsRegistry = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['ops_mlops'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ops/mlops');
      return data.data;
    },
    enabled,
  });
};

export const useModelRegistry = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['ml_registry'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ml/registry');
      return data.data;
    },
    enabled,
  });
};

export const useExperiments = () => {
  return useQuery({
    queryKey: ['ml_experiments'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ml/experiments');
      return data.data;
    },
  });
};

export const useDrift = () => {
  return useQuery({
    queryKey: ['ml_drift'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ml/drift');
      return data.data;
    },
  });
};

export const useMLMetrics = () => {
  return useQuery({
    queryKey: ['ml_metrics'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ml/metrics');
      return data.data;
    },
  });
};

// Custom Hook for Server-Sent Events (SSE)
export const useEventSource = (url: string) => {
  const [lastEvent, setLastEvent] = useState<unknown>(null);

  useEffect(() => {
    // In production, we'd pass auth tokens via cookies or URL params for the EventSource
    const eventSource = new EventSource(apiClient.defaults.baseURL + url);
    
    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setLastEvent(parsedData);
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    eventSource.onerror = (error) => {
      console.warn("SSE Connection Error. Attempting to reconnect...", error);
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return lastEvent;
};
