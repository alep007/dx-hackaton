"use client";

import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { io, Socket } from 'socket.io-client';

interface RealTimeTestUtilsProps {
  tripId?: string | null;
  onTestEvent?: () => void;
}

export const RealTimeTestUtils: React.FC<RealTimeTestUtilsProps> = ({ 
  tripId, 
  onTestEvent 
}) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Test utils connected to WebSocket');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Test utils disconnected from WebSocket');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const emitTestTripChange = () => {
    if (socket && isConnected && tripId) {
      socket.emit('testTripChange', {
        operationType: 'update',
        documentId: tripId,
        fullDocument: { _id: tripId, updatedAt: new Date() },
        timestamp: new Date(),
      });
      console.log('Test trip change emitted for trip:', tripId);
    }
  };

  const emitTestQuotePriceChange = () => {
    if (socket && isConnected && tripId) {
      socket.emit('testQuotePriceChange', {
        operationType: 'insert',
        documentId: 'test-quote-id',
        fullDocument: { 
          _id: 'test-quote-id',
          tripId: tripId,
          amount: Math.floor(Math.random() * 1000) + 500,
          createdAt: new Date(),
        },
        timestamp: new Date(),
      });
      console.log('Test quote price change emitted for trip:', tripId);
    }
  };

  const emitGenericTestEvent = () => {
    if (socket && isConnected) {
      socket.emit('test', { 
        message: 'Test event from frontend',
        tripId,
        timestamp: new Date(),
      });
      console.log('Generic test event emitted');
      onTestEvent?.();
    }
  };

  if (!tripId) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
      <Typography variant="h6" gutterBottom>
        🧪 Real-Time Test Utils
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Test real-time updates for trip: {tripId}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={emitTestTripChange}
          disabled={!isConnected}
        >
          Test Trip Change
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          onClick={emitTestQuotePriceChange}
          disabled={!isConnected}
        >
          Test Quote Price Change
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          onClick={emitGenericTestEvent}
          disabled={!isConnected}
        >
          Test Generic Event
        </Button>
      </Box>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </Typography>
    </Paper>
  );
}; 