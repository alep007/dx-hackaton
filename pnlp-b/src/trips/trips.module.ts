import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { TripQuote, TripQuoteSchema } from '../schemas/trip-quote.schema';
import { QuotePrice, QuotePriceSchema } from '../schemas/quote-price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TripQuote.name, schema: TripQuoteSchema },
      { name: QuotePrice.name, schema: QuotePriceSchema }
    ])
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService]
})
export class TripsModule {} 