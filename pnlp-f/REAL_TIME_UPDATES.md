# Real-Time Updates Guide

This project now supports real-time data updates without requiring page refreshes. Here are the different approaches available:

## 1. Polling-Based Updates (Default)

The simplest approach that automatically refreshes data at regular intervals.

### Basic Usage
```typescript
import { useTableData } from '../hooks/useTableData';

function MyComponent() {
  const { data, isLoading, isFetching, refresh } = useTableData({
    pollingInterval: 5000, // Update every 5 seconds
    autoRefresh: true,
  });

  return (
    <div>
      {isFetching && <div>Updating...</div>}
      {/* Your table content */}
    </div>
  );
}
```

### Available Options
- `pollingInterval`: Time between updates in milliseconds (default: 5000)
- `autoRefresh`: Enable/disable automatic polling (default: true)
- `refetchOnWindowFocus`: Refresh when user returns to tab (default: true)
- `enabled`: Enable/disable the query entirely

### Manual Controls
```typescript
const { 
  data, 
  refresh,        // Manual refresh
  pausePolling,   // Pause automatic updates
  resumePolling   // Resume automatic updates
} = useTableData();
```

## 2. WebSocket-Based Updates

For true real-time updates using WebSocket connections.

### Usage
```typescript
import { useWebSocketData } from '../hooks/useWebSocketData';

function MyComponent() {
  const { 
    isConnected, 
    lastMessage, 
    sendMessage 
  } = useWebSocketData({
    url: 'ws://localhost:3001/ws/trips',
    enabled: true,
  });

  return (
    <div>
      {isConnected ? 'Connected' : 'Disconnected'}
      {/* Your content */}
    </div>
  );
}
```

## 3. Hybrid Approach (Recommended)

Combines both polling and WebSocket for maximum reliability.

### Usage
```typescript
import { useRealTimeData } from '../hooks/useRealTimeData';

function MyComponent() {
  const {
    data,
    isLoading,
    isFetching,
    isConnected,
    updateMode,
    switchToPolling,
    switchToWebSocket,
    switchToHybrid,
    getConnectionStatus,
  } = useRealTimeData({
    mode: 'hybrid', // 'polling' | 'websocket' | 'hybrid'
    pollingInterval: 3000,
    websocketUrl: 'ws://localhost:3001/ws/trips',
  });

  const status = getConnectionStatus();
  
  return (
    <div>
      <div>Status: {status.message}</div>
      <div>Mode: {updateMode}</div>
      {/* Your content */}
    </div>
  );
}
```

## 4. Backend Setup for WebSocket

To enable WebSocket support, you'll need to add WebSocket handling to your NestJS backend:

```typescript
// In your trips.controller.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class TripsController {
  @WebSocketServer()
  server: Server;

  // Emit updates when data changes
  private emitUpdate(data: any) {
    this.server.emit('tripUpdate', data);
  }

  @Post()
  async createTripQuote(@Body() tripQuoteData: Partial<TripQuote>) {
    const result = await this.tripsService.create(tripQuoteData);
    this.emitUpdate(result); // Notify connected clients
    return result;
  }
}
```

## 5. UI Components

The table page now includes real-time status indicators and controls:

- **Status Chip**: Shows current connection status
- **Refresh Button**: Manual refresh
- **Pause/Resume Buttons**: Control automatic updates
- **Mode Switcher**: Switch between polling/websocket/hybrid modes

## 6. Best Practices

1. **Start with Polling**: Use polling for simple real-time needs
2. **Add WebSocket for Critical Updates**: Use WebSocket for immediate updates
3. **Use Hybrid for Reliability**: Combine both for maximum reliability
4. **Handle Connection States**: Always show connection status to users
5. **Implement Retry Logic**: The hooks include automatic retry mechanisms
6. **Optimize Polling Intervals**: Balance between responsiveness and server load

## 7. Configuration Examples

### Fast Updates (1 second)
```typescript
useRealTimeData({
  mode: 'polling',
  pollingInterval: 1000,
});
```

### Conservative Updates (30 seconds)
```typescript
useRealTimeData({
  mode: 'polling',
  pollingInterval: 30000,
});
```

### WebSocket Only
```typescript
useRealTimeData({
  mode: 'websocket',
  websocketUrl: 'ws://localhost:3001/ws/trips',
});
```

### Hybrid with Fast Polling
```typescript
useRealTimeData({
  mode: 'hybrid',
  pollingInterval: 2000,
  websocketUrl: 'ws://localhost:3001/ws/trips',
});
```

## 8. Error Handling

All hooks include built-in error handling:
- Automatic retries with exponential backoff
- Connection status indicators
- Graceful degradation when WebSocket fails
- Fallback to polling when needed

The real-time features are now fully integrated into your table component and will automatically update the data without requiring page refreshes! 