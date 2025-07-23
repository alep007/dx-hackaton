import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuotePriceDocument = QuotePrice & Document;

@Schema({ 
  timestamps: true,
  collection: 'quotePrices', // Explicitly set the collection name
  strict: false // Allow any properties not defined in the schema
})
export class QuotePrice {
  // This will be a flexible schema that accepts any document structure
  // The strict: false option allows any properties
}

export const QuotePriceSchema = SchemaFactory.createForClass(QuotePrice); 