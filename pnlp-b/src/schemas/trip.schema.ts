import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TripDocument = Trip & Document;

@Schema({ timestamps: true })
export class Trip {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  @Prop()
  price: number;

  @Prop()
  participants: number;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const TripSchema = SchemaFactory.createForClass(Trip); 