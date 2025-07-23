// Trip data structure
export interface TripData {
  _id: string;
  title?: string;
  description?: string;
  origin?: string;
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  deliveryDate?: Date;
  createdAt?: Date;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price?: number;
  participants?: number;
  tags?: string[];
  loadType?: string;
  truckType?: string;
  metadata?: Record<string, unknown>;
}

// Quote/Offer data structure
export interface QuoteData {
  _id: string;
  tripId?: string;
  amount: string | number;
  message?: string;
  conversationData?: {
    id?: string;
    [key: string]: unknown;
  };
  createdAt?: string | Date;
  esMejorOferta?: boolean;
  diferencia?: string;
}

// WebSocket message structure
export interface WebSocketMessage {
  type: string;
  data?: unknown;
  [key: string]: unknown;
}

// MongoDB collection info
export interface CollectionInfo {
  name: string;
  type?: string;
  options?: Record<string, unknown>;
  info?: Record<string, unknown>;
}

// Transition props for Material-UI Dialog
export interface TransitionProps {
  children?: React.ReactElement;
  in?: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  [key: string]: unknown;
}

// Form field value types
export type FormFieldValue = string | number | boolean | Date | string[] | null | undefined; 