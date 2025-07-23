# MongoDB Change Stream Monitor

This project demonstrates how to watch/listen for real-time changes in a MongoDB collection using MongoDB Change Streams with a NestJS backend and Next.js frontend.

## Features

- **Real-time MongoDB Change Streams**: Watch for insert, update, delete operations
- **WebSocket Communication**: Real-time updates from backend to frontend
- **Material UI Interface**: Modern, responsive UI for monitoring changes
- **Trip Management**: Create, read, update, delete trips with real-time notifications

## Architecture

```
Frontend (Next.js + Material UI) ←→ WebSocket ←→ Backend (NestJS) ←→ MongoDB Change Streams
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.2 or higher with replica set enabled)
- npm or yarn

## Setup Instructions

### 1. MongoDB Setup

**Important**: MongoDB Change Streams require a replica set. For local development:

```bash
# Start MongoDB with replica set
mongod --replSet rs0 --port 27017

# In another terminal, initialize the replica set
mongosh --eval "rs.initiate()"
```

### 2. Backend Setup

```bash
cd pnlp-b

# Install dependencies
npm install

# Update MongoDB connection string in src/app.module.ts if needed
# Default: mongodb://localhost:27017/trips-db

# Start the development server
npm run start:dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd pnlp-f

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### 1. Monitor Real-time Changes

1. Navigate to `http://localhost:3000/monitor`
2. The page will show the real-time change monitor
3. You'll see connection status and any changes that occur

### 2. Create Trips to Test

1. Use the form on the monitor page to create new trips
2. Each creation will trigger a real-time change event
3. Watch the changes appear in the monitor in real-time

### 3. API Endpoints

The backend provides these REST endpoints:

- `GET /trips` - Get all trips (with optional status/destination filters)
- `GET /trips/:id` - Get trip details
- `POST /trips` - Create new trip
- `PUT /trips/:id` - Update trip
- `DELETE /trips/:id` - Delete trip

### 4. WebSocket Events

The backend emits these WebSocket events:

- `tripChange` - Emitted when any trip document changes
  - `operationType`: 'insert' | 'update' | 'delete' | 'replace'
  - `documentId`: The changed document's ID
  - `fullDocument`: The complete document (for insert/update)
  - `timestamp`: When the change occurred

## How It Works

### Backend (NestJS)

1. **MongoDB Change Streams**: The `TripsService` uses `tripModel.watch()` to listen for changes
2. **WebSocket Gateway**: Changes are immediately broadcasted to all connected clients
3. **Real-time Updates**: No polling required - changes are pushed instantly

### Frontend (Next.js)

1. **WebSocket Connection**: `useTripChanges` hook connects to the backend WebSocket
2. **Real-time UI Updates**: Changes are displayed immediately in the UI
3. **Material UI Components**: Modern, responsive interface for monitoring

## Key Files

### Backend
- `src/schemas/trip.schema.ts` - MongoDB schema definition
- `src/trips/trips.service.ts` - Service with change stream logic
- `src/trips/trips.controller.ts` - REST API endpoints
- `src/app.module.ts` - MongoDB connection setup

### Frontend
- `src/hooks/useTripChanges.ts` - WebSocket connection hook
- `src/components/TripChangesMonitor.tsx` - Real-time monitor UI
- `src/components/TripForm.tsx` - Trip creation form
- `src/services/tripApi.ts` - API service for REST calls

## Alternative Approaches

### 1. Frontend Polling (Not Recommended)
```javascript
// Poll every 5 seconds
setInterval(async () => {
  const trips = await fetch('/api/trips');
  // Update UI
}, 5000);
```

### 2. Server-Sent Events (SSE)
```javascript
// Backend
app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  // Send changes as SSE
  changeStream.on('change', (change) => {
    res.write(`data: ${JSON.stringify(change)}\n\n`);
  });
});
```

### 3. GraphQL Subscriptions
```javascript
// Using GraphQL with subscriptions
const TRIP_CHANGED = gql`
  subscription OnTripChanged {
    tripChanged {
      operationType
      documentId
      fullDocument
    }
  }
`;
```

## Why MongoDB Change Streams?

1. **Real-time**: No polling required
2. **Efficient**: Only sends changes, not full data
3. **Reliable**: Built into MongoDB, handles reconnections
4. **Scalable**: Works with sharded clusters
5. **Filterable**: Can watch specific documents or collections

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running with replica set enabled
- Check connection string in `app.module.ts`
- Verify MongoDB version supports change streams (4.2+)

### WebSocket Connection Issues
- Check CORS settings in `TripsService`
- Ensure backend is running on port 3001
- Check browser console for connection errors

### Change Stream Not Working
- Verify replica set is properly initialized
- Check MongoDB logs for errors
- Ensure collection has proper indexes

## Production Considerations

1. **Security**: Add authentication to WebSocket connections
2. **Scaling**: Use Redis for WebSocket scaling
3. **Monitoring**: Add logging and metrics
4. **Error Handling**: Implement retry logic for disconnections
5. **Rate Limiting**: Prevent abuse of change streams

## License

MIT 