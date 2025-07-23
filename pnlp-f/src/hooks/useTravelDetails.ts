import { useState, useEffect, useCallback } from 'react';
import { useTripSpecificUpdates } from './useTripSpecificUpdates';

// Travel details data structure
interface TravelDetails {
  _id: string;
  createdAt: string;
  amount: string;
  conversationData: unknown;
  esMejorOferta?: boolean;
  diferencia?: string;
  message: string;
}

// Real fetch function for travel details
async function fetchTravelDetails(travelId: string): Promise<TravelDetails[]> {
  const response = await fetch(`https://dx-hackaton.onrender.com/quotes/${travelId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch travel details: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

interface UseTravelDetailsOptions {
  enableRealTime?: boolean;
  pollingInterval?: number;
  serverUrl?: string;
}

export function useTravelDetails(options: UseTravelDetailsOptions = {}) {
  const {
    enableRealTime = true,
    pollingInterval = 3000,
    serverUrl = 'http://localhost:3001',
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [travelDetails, setTravelDetails] = useState<TravelDetails[] | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Trip-specific real-time updates
  const {
    isConnected,
    lastUpdate: socketLastUpdate,
    relevantChanges,
  } = useTripSpecificUpdates({
    enabled: enableRealTime,
    tripId: selectedTripId,
    serverUrl,
  });

  // Polling effect for real-time updates (fallback)
  useEffect(() => {
    if (!enableRealTime || !selectedTripId) return;

    const interval = setInterval(async () => {
      try {
        const details = await fetchTravelDetails(selectedTripId);
        setTravelDetails(details);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error polling travel details:', error);
      }
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [selectedTripId, enableRealTime, pollingInterval]);

  // Listen for relevant changes and refresh data
  useEffect(() => {
    if (!enableRealTime || !selectedTripId || relevantChanges.length === 0) return;

    // Get the most recent change
    const latestChange = relevantChanges[relevantChanges.length - 1];
    
    if (latestChange) {
      console.log('Relevant change detected, refreshing travel details...');
      const refreshData = async () => {
        try {
          const details = await fetchTravelDetails(selectedTripId);
          setTravelDetails(details);
          setLastUpdate(new Date());
          console.log('Travel details refreshed successfully after real-time update');
        } catch (error) {
          console.error('Error refreshing travel details after real-time update:', error);
        }
      };
      refreshData();
    }
  }, [relevantChanges, selectedTripId, enableRealTime]);

  // Update lastUpdate when socket provides a new update
  useEffect(() => {
    if (socketLastUpdate) {
      setLastUpdate(socketLastUpdate);
    }
  }, [socketLastUpdate]);

  const getTravelDetails = useCallback(async (id: string) => {
    setIsLoading(true);
    setSelectedTripId(id);
    
    try {
      const details = await fetchTravelDetails(id);
      setTravelDetails(details);
      setLastUpdate(new Date());
      return details;
    } catch (error) {
      console.error('Error fetching travel details:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshDetails = useCallback(async () => {
    if (!selectedTripId) return;
    
    try {
      const details = await fetchTravelDetails(selectedTripId);
      setTravelDetails(details);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing travel details:', error);
    }
  }, [selectedTripId]);

  const clearDetails = useCallback(() => {
    setTravelDetails(null);
    setSelectedTripId(null);
    setLastUpdate(null);
  }, []);

  return {
    getTravelDetails,
    refreshDetails,
    clearDetails,
    isLoading,
    travelDetails,
    selectedTripId,
    lastUpdate,
    isConnected,
    enableRealTime,
    relevantChangesCount: relevantChanges.length,
  };
}

export type { TravelDetails };
