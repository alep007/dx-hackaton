import { useQuery, useQueryClient } from '@tanstack/react-query';

// Real API fetch function
async function fetchTableData() {
  const response = await fetch('http://localhost:3001/trips');
  if (!response.ok) {
    throw new Error('Failed to fetch trips data');
  }
  return response.json();
}

export function useTableData(options?: {
  pollingInterval?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  autoRefresh?: boolean;
}) {
  const queryClient = useQueryClient();
  const {
    pollingInterval = 5000, // Poll every 5 seconds by default
    enabled = true,
    refetchOnWindowFocus = true,
    autoRefresh = true,
  } = options || {};

  const query = useQuery({
    queryKey: ['tableData'],
    queryFn: fetchTableData,
    refetchInterval: autoRefresh ? pollingInterval : false, // Enable polling only if autoRefresh is true
    refetchIntervalInBackground: true, // Continue polling even when tab is not active
    refetchOnWindowFocus, // Refetch when user returns to the tab
    staleTime: 0, // Data is considered stale immediately, allowing frequent updates
    gcTime: 5 * 60 * 1000, // Keep data in cache for 5 minutes
    enabled, // Allow disabling the query
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Manual refresh function
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['tableData'] });
  };

  // Pause/resume polling
  const pausePolling = () => {
    queryClient.setQueryDefaults(['tableData'], { refetchInterval: false });
  };

  const resumePolling = () => {
    queryClient.setQueryDefaults(['tableData'], { refetchInterval: pollingInterval });
  };

  return {
    ...query,
    refresh,
    pausePolling,
    resumePolling,
  };
} 