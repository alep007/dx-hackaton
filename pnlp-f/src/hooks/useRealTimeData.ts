import { useState, useEffect } from 'react';
import { useTableData } from './useTableData';
import { useWebSocketData } from './useWebSocketData';

type UpdateMode = 'polling' | 'websocket' | 'hybrid';

interface RealTimeDataOptions {
  mode?: UpdateMode;
  pollingInterval?: number;
  websocketUrl?: string;
  enabled?: boolean;
}

export function useRealTimeData(options: RealTimeDataOptions = {}) {
  const {
    mode = 'polling',
    pollingInterval = 5000,
    websocketUrl = 'ws://localhost:3001/ws/trips',
    enabled = true,
  } = options;

  const [updateMode, setUpdateMode] = useState<UpdateMode>(mode);

  // Polling-based updates
  const pollingData = useTableData({
    pollingInterval: updateMode === 'polling' || updateMode === 'hybrid' ? pollingInterval : undefined,
    enabled: enabled && (updateMode === 'polling' || updateMode === 'hybrid'),
    autoRefresh: updateMode === 'polling' || updateMode === 'hybrid',
  });

  // WebSocket-based updates
  const websocketData = useWebSocketData({
    url: websocketUrl,
    enabled: enabled && (updateMode === 'websocket' || updateMode === 'hybrid'),
  });

  // Determine which data source to use
  const isPollingActive = updateMode === 'polling' || updateMode === 'hybrid';
  const isWebSocketActive = updateMode === 'websocket' || updateMode === 'hybrid';

  const data = pollingData.data;
  const isLoading = pollingData.isLoading;
  const isFetching = pollingData.isFetching;
  const error = pollingData.error;

  // Status indicators
  const isConnected = websocketData.isConnected;
  const lastWebSocketMessage = websocketData.lastMessage;

  // Control functions
  const refresh = () => {
    pollingData.refresh();
  };

  const pausePolling = () => {
    pollingData.pausePolling();
  };

  const resumePolling = () => {
    pollingData.resumePolling();
  };

  const switchToPolling = () => {
    setUpdateMode('polling');
  };

  const switchToWebSocket = () => {
    setUpdateMode('websocket');
  };

  const switchToHybrid = () => {
    setUpdateMode('hybrid');
  };

  // Get connection status
  const getConnectionStatus = () => {
    if (updateMode === 'polling') {
      return {
        status: isFetching ? 'updating' : 'connected',
        mode: 'polling',
        message: isFetching ? 'Actualizando...' : 'En vivo (polling)',
      };
    } else if (updateMode === 'websocket') {
      return {
        status: isConnected ? 'connected' : 'disconnected',
        mode: 'websocket',
        message: isConnected ? 'En vivo (WebSocket)' : 'Desconectado',
      };
    } else {
      // Hybrid mode
      return {
        status: isConnected && !isFetching ? 'connected' : isFetching ? 'updating' : 'disconnected',
        mode: 'hybrid',
        message: isConnected 
          ? (isFetching ? 'Actualizando...' : 'En vivo (híbrido)')
          : 'Desconectado',
      };
    }
  };

  return {
    // Data
    data,
    isLoading,
    isFetching,
    error,
    
    // WebSocket specific
    isConnected,
    lastWebSocketMessage,
    
    // Controls
    refresh,
    pausePolling,
    resumePolling,
    
    // Mode switching
    updateMode,
    switchToPolling,
    switchToWebSocket,
    switchToHybrid,
    
    // Status
    getConnectionStatus,
    isPollingActive,
    isWebSocketActive,
  };
} 