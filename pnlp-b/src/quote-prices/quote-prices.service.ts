import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ChangeStream } from 'mongodb';
import { QuotePrice, QuotePriceDocument } from '../schemas/quote-price.schema';
import { ChangeStreamDocument } from '../types';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST'],
  },
})
export class QuotePricesService implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  server: Server;

  private changeStream: ChangeStream;

  constructor(
    @InjectModel(QuotePrice.name)
    private quotePriceModel: Model<QuotePriceDocument>,
  ) {}

  async onModuleInit() {
    // Start watching for changes in the quotePrices collection
    this.startChangeStream();
  }

  async onModuleDestroy() {
    // Clean up change stream when service is destroyed
    if (this.changeStream) {
      await this.changeStream.close();
    }
  }

  private startChangeStream() {
    this.changeStream = this.quotePriceModel.watch([], {
      fullDocument: 'updateLookup',
    });

    this.changeStream.on('change', (change) => {
      console.log('QuotePrices collection changed:', change);

      // Emit the change to all connected clients
      this.server.emit('quotePriceChange', {
        operationType: change.operationType,
        documentId: (change as unknown as ChangeStreamDocument).documentKey?._id,
        fullDocument: (change as unknown as ChangeStreamDocument).fullDocument,
        timestamp: new Date(),
      });
    });

    this.changeStream.on('error', (error) => {
      console.error('QuotePrices change stream error:', error);
    });
  }

  // Get all quote prices
  async findAll(): Promise<QuotePrice[]> {
    console.log('🔍 Attempting to fetch all quote prices from database...');
    try {
      const results = await this.quotePriceModel.find().exec();
      console.log('✅ Database query successful');
      console.log('📊 Total documents found:', results.length);
      if (results.length > 0) {
        console.log('📄 Sample document:', JSON.stringify(results[0], null, 2));
      } else {
        console.log('📭 Collection is empty');
      }
      return results;
    } catch (error) {
      console.error('❌ Database query failed:', error);
      throw error;
    }
  }

  // Get quote price by ID
  async findById(id: string): Promise<QuotePrice> {
    console.log('🔍 Searching for quote price with id:', id);
    try {
      const results = await this.quotePriceModel.find({ tripId: id }).exec();
      console.log('✅ Database query successful for tripId:', id);

      return results;
    } catch (error) {
      console.error('❌ Database query failed:', error);
      throw error;
    }
  }

  // Create new quote price
  async create(quotePriceData: Partial<QuotePrice>): Promise<QuotePrice> {
    const quotePrice = new this.quotePriceModel(quotePriceData);
    return quotePrice.save();
  }

  // Update quote price
  async update(
    id: string,
    quotePriceData: Partial<QuotePrice>,
  ): Promise<QuotePrice> {
    return this.quotePriceModel
      .findByIdAndUpdate(id, quotePriceData, { new: true })
      .exec();
  }

  // Delete quote price
  async delete(id: string): Promise<QuotePrice> {
    return this.quotePriceModel.findByIdAndDelete(id).exec();
  }

  // Get quote prices by status (if status field exists)
  async findByStatus(status: string): Promise<QuotePrice[]> {
    console.log('🔍 Searching for quote prices with status:', status);
    try {
      const results = await this.quotePriceModel.find({ status }).exec();
      console.log('✅ Status query successful');
      console.log('📊 Documents with status "' + status + '":', results.length);
      if (results.length > 0) {
        console.log(
          '📄 Sample document with status "' + status + '":',
          JSON.stringify(results[0], null, 2),
        );
      }
      return results;
    } catch (error) {
      console.error('❌ Status query failed:', error);
      throw error;
    }
  }

  // Get quote prices by destination (if destination field exists)
  async findByDestination(destination: string): Promise<QuotePrice[]> {
    return this.quotePriceModel
      .find({
        destination: { $regex: destination, $options: 'i' },
      })
      .exec();
  }

  // Get quote prices by price range
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<QuotePrice[]> {
    return this.quotePriceModel
      .find({
        price: { $gte: minPrice, $lte: maxPrice },
      })
      .exec();
  }

  // Get quote prices by trip quote ID
  async findByTripQuoteId(tripQuoteId: string): Promise<QuotePrice[]> {
    console.log('🔍 Searching for quote prices with tripQuoteId:', tripQuoteId);
    try {
      const results = await this.quotePriceModel.find({ tripQuoteId }).exec();
      console.log('✅ Trip quote ID query successful');
      console.log(
        '📊 Documents with tripQuoteId "' + tripQuoteId + '":',
        results.length,
      );
      if (results.length > 0) {
        console.log(
          '📄 Sample document with tripQuoteId "' + tripQuoteId + '":',
          JSON.stringify(results[0], null, 2),
        );
      }
      return results;
    } catch (error) {
      console.error('❌ Trip quote ID query failed:', error);
      throw error;
    }
  }
}
