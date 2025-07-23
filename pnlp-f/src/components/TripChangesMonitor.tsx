"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Button,
  Divider
} from '@mui/material';
import {
  Wifi,
  WifiOff,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material';
import { useTripChanges, TripChangeEvent } from '../hooks/useTripChanges';

const getOperationIcon = (operationType: string) => {
  switch (operationType) {
    case 'insert':
      return <Add color="success" />;
    case 'update':
      return <Edit color="primary" />;
    case 'delete':
      return <Delete color="error" />;
    case 'replace':
      return <Edit color="warning" />;
    default:
      return <Visibility color="info" />;
  }
};

const getOperationColor = (operationType: string) => {
  switch (operationType) {
    case 'insert':
      return 'success';
    case 'update':
      return 'primary';
    case 'delete':
      return 'error';
    case 'replace':
      return 'warning';
    default:
      return 'info';
  }
};

export const TripChangesMonitor: React.FC = () => {
  const {
    isConnected,
    lastChange,
    changes,
    clearChanges,
    emitTestEvent
  } = useTripChanges();

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
              Real-time Trip Changes Monitor
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isConnected ? (
                <Wifi color="success" />
              ) : (
                <WifiOff color="error" />
              )}
              <Chip
                label={isConnected ? 'Connected' : 'Disconnected'}
                color={isConnected ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={clearChanges}
              sx={{ mr: 1 }}
            >
              Clear History
            </Button>
            <Button
              variant="outlined"
              onClick={emitTestEvent}
              disabled={!isConnected}
            >
              Test Connection
            </Button>
          </Box>

          {!isConnected && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Not connected to the server. Make sure your backend is running on port 3001.
            </Alert>
          )}

          {lastChange && (
            <Card sx={{ mb: 2, bgcolor: 'grey.50' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Latest Change
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {getOperationIcon(lastChange.operationType)}
                  <Chip
                    label={lastChange.operationType.toUpperCase()}
                    color={getOperationColor(lastChange.operationType) as any}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formatTimestamp(lastChange.timestamp)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Document ID: {lastChange.documentId}
                </Typography>
                {lastChange.fullDocument && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Title:</strong> {lastChange.fullDocument.title}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Change History ({changes.length})
          </Typography>

          {changes.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No changes detected yet. Changes will appear here in real-time.
            </Typography>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {changes.slice().reverse().map((change, index) => (
                <ListItem
                  key={`${change.documentId}-${change.timestamp}-${index}`}
                  sx={{
                    border: 1,
                    borderColor: 'grey.300',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: 'white'
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getOperationIcon(change.operationType)}
                        <Chip
                          label={change.operationType.toUpperCase()}
                          color={getOperationColor(change.operationType) as any}
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatTimestamp(change.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          Document ID: {change.documentId}
                        </Typography>
                        {change.fullDocument && (
                          <Typography variant="body2">
                            Title: {change.fullDocument.title}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}; 