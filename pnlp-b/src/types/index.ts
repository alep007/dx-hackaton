// MongoDB collection info
export interface CollectionInfo {
  name: string;
  type?: string;
  options?: Record<string, unknown>;
  info?: Record<string, unknown>;
}

// Database error type
export interface DatabaseError {
  message: string;
  code?: string;
  [key: string]: unknown;
}

// MongoDB change stream types
export interface ChangeStreamDocument {
  operationType: 'insert' | 'update' | 'delete' | 'replace' | 'drop' | 'rename' | 'dropDatabase' | 'invalidate';
  documentKey?: {
    _id: string;
  };
  fullDocument?: Record<string, unknown>;
  [key: string]: unknown;
}

// Quote price document type
export interface QuotePriceDocument {
  _id: string;
  tripId?: string;
  amount?: number;
  [key: string]: unknown;
} 