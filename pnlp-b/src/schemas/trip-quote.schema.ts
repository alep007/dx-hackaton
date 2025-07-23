import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TripQuoteDocument = TripQuote & Document;

@Schema({ 
  timestamps: true,
  collection: 'quoteTrips', // Explicitly set the collection name
  strict: false // Allow any properties not defined in the schema
})
export class TripQuote {
  // This will be a flexible schema that accepts any document structure
  // The strict: false option allows any properties
}

export const TripQuoteSchema = SchemaFactory.createForClass(TripQuote); 