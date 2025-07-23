"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface TripChangeEvent {
  operationType: 'insert' | 'update' | 'delete' | 'replace' | 'drop' | 'rename' | 'dropDatabase' | 'invalidate';
  documentId: string;
  fullDocument?: any;
  timestamp: Date;
}

export interface QuotePriceChangeEvent {
  operationType: 'insert' | 'update' | 'delete' | 'replace' | 'drop' | 'rename' | 'dropDatabase' | 'invalidate';
  documentId: string;
  fullDocument?: any;
  timestamp: Date;
}

interface UseTripSpecificUpdatesOptions {
  enabled?: boolean;
  tripId?: string | null;
  serverUrl?: string;
}

export const useTripSpecificUpdates = (options: UseTripSpecificUpdatesOptions = {}) => {
  const {
    enabled = true,
    tripId = null,
    serverUrl = 'http://localhost:3001',
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastTripChange, setLastTripChange] = useState<TripChangeEvent | null>(null);
  const [lastQuotePriceChange, setLastQuotePriceChange] = useState<QuotePriceChangeEvent | null>(null);
  const [relevantChanges, setRelevantChanges] = useState<(TripChangeEvent | QuotePriceChangeEvent)[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!enabled) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling']
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Connected to trip-specific updates WebSocket');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from trip-specific updates WebSocket');
      setIsConnected(false);
    });

    newSocket.on('tripChange', (change: TripChangeEvent) => {
      console.log('Received trip change:', change);
      
      // Check if this change is relevant to our selected trip
      if (tripId && change.documentId === tripId) {
        console.log('Relevant trip change detected for trip:', tripId);
        setLastTripChange(change);
        setRelevantChanges(prev => [...prev, change]);
        setLastUpdate(new Date());
      }
    });

    newSocket.on('quotePriceChange', (change: QuotePriceChangeEvent) => {
      console.log('Received quote price change:', change);
      
      // Check if this change is relevant to our selected trip
      if (tripId && change.fullDocument && change.fullDocument.tripId === tripId) {
        console.log('Relevant quote price change detected for trip:', tripId);
        setLastQuotePriceChange(change);
        setRelevantChanges(prev => [...prev, change]);
        setLastUpdate(new Date());
      }
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [enabled, serverUrl]);

  // Update trip ID and clear irrelevant changes
  useEffect(() => {
    if (tripId) {
      // Clear previous changes when switching to a new trip
      setRelevantChanges([]);
      setLastTripChange(null);
      setLastQuotePriceChange(null);
      setLastUpdate(null);
    }
  }, [tripId]);

  // Function to clear changes history
  const clearChanges = useCallback(() => {
    setRelevantChanges([]);
    setLastTripChange(null);
    setLastQuotePriceChange(null);
    setLastUpdate(null);
  }, []);

  // Function to manually emit a test event (for development)
  const emitTestEvent = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('test', { message: 'Test event from frontend', tripId });
    }
  }, [socket, isConnected, tripId]);

  // Function to get connection status
  const getConnectionStatus = useCallback(() => {
    return {
      isConnected,
      tripId,
      lastUpdate,
      relevantChangesCount: relevantChanges.length,
    };
  }, [isConnected, tripId, lastUpdate, relevantChanges.length]);

  return {
    socket,
    isConnected,
    lastTripChange,
    lastQuotePriceChange,
    relevantChanges,
    lastUpdate,
    clearChanges,
    emitTestEvent,
    getConnectionStatus,
  };
}; 