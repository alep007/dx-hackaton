import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ChangeStream } from 'mongodb';
import { TripQuote, TripQuoteDocument } from '../schemas/trip-quote.schema';
import { QuotePrice, QuotePriceDocument } from '../schemas/quote-price.schema';
import { ChangeStreamDocument, QuotePriceDocument as QuotePriceDoc } from '../types';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST'],
  },
})
export class TripsService implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  server: Server;

  private changeStream: ChangeStream;

  constructor(
    @InjectModel(TripQuote.name)
    private tripQuoteModel: Model<TripQuoteDocument>,
    @InjectModel(QuotePrice.name)
    private quotePriceModel: Model<QuotePriceDocument>,
  ) {}

  async onModuleInit() {
    // Start watching for changes in the trips collection
    this.startChangeStream();
  }

  async onModuleDestroy() {
    // Clean up change stream when service is destroyed
    if (this.changeStream) {
      await this.changeStream.close();
    }
  }

  private startChangeStream() {
    this.changeStream = this.tripQuoteModel.watch([], {
      fullDocument: 'updateLookup',
    });

    this.changeStream.on('change', (change) => {
      console.log('Trip collection changed:', change);

      // Emit the change to all connected clients
      this.server.emit('tripChange', {
        operationType: change.operationType,
        documentId: (change as unknown as ChangeStreamDocument).documentKey?._id,
        fullDocument: (change as unknown as ChangeStreamDocument).fullDocument,
        timestamp: new Date(),
      });
    });

    this.changeStream.on('error', (error) => {
      console.error('Change stream error:', error);
    });
  }

  // Helper method to get quote prices data for a trip
  private async getQuotePricesData(tripId: string) {
    try {
      const quotePrices = await this.quotePriceModel.find({ tripId }).exec();
      const quotes = quotePrices.length;
      const bestOffer = quotes > 0 ? Math.min(...quotePrices.map(qp => (qp as unknown as QuotePriceDoc).amount || Infinity)) : null;
      
      return { bestOffer, quotes };
    } catch (error) {
      console.error('❌ Quote prices query failed:', error);
      return { bestOffer: null, quotes: 0 };
    }
  }

  // Get all trip quotes
  async findAll(): Promise<TripQuote[]> {
    try {
      const results = await this.tripQuoteModel.find().exec();
      
      // Add quote prices data to each trip
      const enrichedResults = await Promise.all(
        results.map(async (trip) => {
          const quoteData = await this.getQuotePricesData(trip._id.toString());
          return {
            ...trip.toObject(),
            bestOffer: quoteData.bestOffer,
            quotes: quoteData.quotes,
          };
        })
      );
      
      return enrichedResults;
    } catch (error) {
      console.error('❌ Database query failed:', error);
      throw error;
    }
  }

  // Get trip quote by ID
  async findById(id: string): Promise<TripQuote> {
    const trip = await this.tripQuoteModel.findById(id).exec();
    if (!trip) return null;
    
    const quoteData = await this.getQuotePricesData(id);
    return {
      ...trip.toObject(),
      bestOffer: quoteData.bestOffer,
      quotes: quoteData.quotes,
    };
  }

  // Create new trip quote
  async create(tripQuoteData: Partial<TripQuote>): Promise<TripQuote> {
    const tripQuote = new this.tripQuoteModel(tripQuoteData);
    return tripQuote.save();
  }

  // Update trip quote
  async update(
    id: string,
    tripQuoteData: Partial<TripQuote>,
  ): Promise<TripQuote> {
    return this.tripQuoteModel
      .findByIdAndUpdate(id, tripQuoteData, { new: true })
      .exec();
  }

  // Delete trip quote
  async delete(id: string): Promise<TripQuote> {
    return this.tripQuoteModel.findByIdAndDelete(id).exec();
  }

  // Get trip quotes by status (if status field exists)
  async findByStatus(status: string): Promise<TripQuote[]> {
    console.log('🔍 Searching for trip quotes with status:', status);
    try {
      const results = await this.tripQuoteModel.find({ status }).exec();
      console.log('✅ Status query successful');
      console.log('📊 Documents with status "' + status + '":', results.length);
      if (results.length > 0) {
        console.log(
          '📄 Sample document with status "' + status + '":',
          JSON.stringify(results[0], null, 2),
        );
      }
      
      // Add quote prices data to each trip
      const enrichedResults = await Promise.all(
        results.map(async (trip) => {
          const quoteData = await this.getQuotePricesData(trip._id.toString());
          return {
            ...trip.toObject(),
            bestOffer: quoteData.bestOffer,
            quotes: quoteData.quotes,
          };
        })
      );
      
      return enrichedResults;
    } catch (error) {
      console.error('❌ Status query failed:', error);
      throw error;
    }
  }

  // Get trip quotes by destination (if destination field exists)
  async findByDestination(destination: string): Promise<TripQuote[]> {
    const results = await this.tripQuoteModel
      .find({
        destination: { $regex: destination, $options: 'i' },
      })
      .exec();
    
    // Add quote prices data to each trip
    const enrichedResults = await Promise.all(
      results.map(async (trip) => {
        const quoteData = await this.getQuotePricesData(trip._id.toString());
        return {
          ...trip.toObject(),
          bestOffer: quoteData.bestOffer,
          quotes: quoteData.quotes,
        };
      })
    );
    
    return enrichedResults;
  }
}
