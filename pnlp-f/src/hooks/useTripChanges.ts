"use client";

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { TripData } from '../types';

export interface TripChangeEvent {
  operationType: 'insert' | 'update' | 'delete' | 'replace' | 'drop' | 'rename' | 'dropDatabase' | 'invalidate';
  documentId: string;
  fullDocument?: TripData;
  timestamp: Date;
}

export interface Trip {
  _id: string;
  title: string;
  description?: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price?: number;
  participants?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useTripChanges = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastChange, setLastChange] = useState<TripChangeEvent | null>(null);
  const [changes, setChanges] = useState<TripChangeEvent[]>([]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to trip changes WebSocket');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from trip changes WebSocket');
      setIsConnected(false);
    });

    newSocket.on('tripChange', (change: TripChangeEvent) => {
      console.log('Received trip change:', change);
      setLastChange(change);
      setChanges(prev => [...prev, change]);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Function to clear changes history
  const clearChanges = useCallback(() => {
    setChanges([]);
    setLastChange(null);
  }, []);

  // Function to manually emit a test event (for development)
  const emitTestEvent = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('test', { message: 'Test event from frontend' });
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    lastChange,
    changes,
    clearChanges,
    emitTestEvent
  };
}; 