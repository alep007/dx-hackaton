# Real-Time Updates for TravelDetails Component

This document explains how real-time updates work for the TravelDetails component when a trip is selected.

## Overview

The TravelDetails component now supports real-time updates that automatically refresh the trip's quote data when changes occur in the backend. This is achieved through a combination of:

1. **WebSocket-based real-time updates** - Immediate updates when changes occur
2. **Polling fallback** - Regular polling as a backup mechanism
3. **Trip-specific filtering** - Only updates when changes are relevant to the selected trip

## Architecture

```
Frontend (TravelDetails) ←→ useTripSpecificUpdates ←→ WebSocket ←→ Backend (MongoDB Change Streams)
```

## Key Components

### 1. useTripSpecificUpdates Hook

Located in `src/hooks/useTripSpecificUpdates.ts`, this hook:
- Connects to the backend WebSocket server
- Listens for `tripChange` and `quotePriceChange` events
- Filters events to only those relevant to the selected trip
- Tracks relevant changes and provides connection status

### 2. Enhanced useTravelDetails Hook

Located in `src/hooks/useTravelDetails.ts`, this hook:
- Integrates with `useTripSpecificUpdates` for real-time updates
- Provides polling as a fallback mechanism
- Manages the travel details data state
- Handles loading states and error handling

### 3. Updated TravelDetails Component

Located in `src/components/TravelDetails.tsx`, the component now:
- Shows real-time connection status
- Displays last update timestamp
- Shows count of relevant changes
- Provides manual refresh functionality
- Includes development test utilities

## Features

### Real-Time Status Indicators

The TravelDetails component header now shows:
- **Connection Status**: Green "En vivo" chip when connected, red "Desconectado" when disconnected
- **Last Update Time**: Shows when the data was last updated
- **Relevant Changes Count**: Shows how many relevant changes have been detected
- **Refresh Button**: Manual refresh functionality

### Automatic Updates

The component automatically refreshes when:
1. **Quote Price Changes**: New quotes are added or existing quotes are modified for the selected trip
2. **Trip Changes**: The selected trip itself is modified
3. **Polling Fallback**: Regular polling ensures data stays fresh even if WebSocket fails

### Development Tools

In development mode, the component includes test utilities:
- **Test Trip Change**: Simulates a trip update event
- **Test Quote Price Change**: Simulates a new quote price event
- **Test Generic Event**: Sends a generic test event

## Configuration

### useTravelDetails Options

```typescript
const { 
  getTravelDetails, 
  refreshDetails,
  clearDetails,
  isLoading, 
  travelDetails,
  selectedTripId,
  lastUpdate,
  isConnected,
  relevantChangesCount,
} = useTravelDetails({
  enableRealTime: true,        // Enable/disable real-time updates
  pollingInterval: 5000,       // Polling interval in milliseconds
  serverUrl: 'http://localhost:3001', // Backend server URL
});
```

### useTripSpecificUpdates Options

```typescript
const {
  isConnected,
  lastUpdate,
  relevantChanges,
  clearChanges,
  getConnectionStatus,
} = useTripSpecificUpdates({
  enabled: true,               // Enable/disable the hook
  tripId: selectedTripId,      // The trip ID to watch
  serverUrl: 'http://localhost:3001', // Backend server URL
});
```

## Backend Integration

The real-time updates rely on the backend's MongoDB Change Streams:

### Trip Changes
- Backend emits `tripChange` events when trip documents change
- Frontend filters these events to only those affecting the selected trip

### Quote Price Changes
- Backend emits `quotePriceChange` events when quote price documents change
- Frontend filters these events to only those with `tripId` matching the selected trip

## Usage Example

```typescript
// In your component
const { 
  getTravelDetails, 
  travelDetails,
  isConnected,
  lastUpdate,
  relevantChangesCount,
  refreshDetails 
} = useTravelDetails({
  enableRealTime: true,
  pollingInterval: 5000,
});

// Pass to TravelDetails component
<TravelDetailsComponent
  data={travelDetails}
  rowData={selectedRowData}
  onClose={handleClose}
  open={!!selectedRowData}
  isConnected={isConnected}
  lastUpdate={lastUpdate}
  onRefresh={refreshDetails}
  relevantChangesCount={relevantChangesCount}
/>
```

## Error Handling

The implementation includes comprehensive error handling:
- **WebSocket Connection Failures**: Falls back to polling
- **API Request Failures**: Logs errors and maintains previous state
- **Data Parsing Errors**: Handles malformed WebSocket messages
- **Network Issues**: Automatic reconnection attempts

## Performance Considerations

1. **Efficient Filtering**: Only processes events relevant to the selected trip
2. **Debounced Updates**: Prevents excessive API calls during rapid changes
3. **Connection Management**: Proper cleanup of WebSocket connections
4. **Memory Management**: Clears irrelevant data when switching trips

## Testing

### Manual Testing
1. Open the TravelDetails component for a trip
2. Use the test utilities to simulate changes
3. Verify that the data updates automatically
4. Check that the status indicators update correctly

### Automated Testing
The hooks can be tested by:
- Mocking WebSocket connections
- Simulating change events
- Verifying state updates
- Testing error scenarios

## Troubleshooting

### Common Issues

1. **No Real-Time Updates**
   - Check WebSocket connection status
   - Verify backend is running and emitting events
   - Check browser console for connection errors

2. **Updates Not Relevant**
   - Verify trip ID filtering is working
   - Check that backend events include correct trip IDs

3. **Performance Issues**
   - Reduce polling interval if needed
   - Check for memory leaks in WebSocket connections
   - Monitor API call frequency

### Debug Information

The implementation includes extensive console logging:
- WebSocket connection status
- Received events and filtering results
- Data refresh operations
- Error conditions

## Future Enhancements

Potential improvements:
1. **Optimistic Updates**: Update UI immediately, then sync with server
2. **Conflict Resolution**: Handle concurrent updates
3. **Offline Support**: Queue updates when disconnected
4. **Advanced Filtering**: More sophisticated event filtering
5. **Metrics**: Track update frequency and performance

## Conclusion

The real-time updates for the TravelDetails component provide a seamless user experience with automatic data synchronization. The hybrid approach of WebSocket + polling ensures reliability while the trip-specific filtering ensures efficiency. 