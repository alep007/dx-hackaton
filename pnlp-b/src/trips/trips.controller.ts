import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripQuote } from '../schemas/trip-quote.schema';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  async getTripQuotes(
    @Query('status') status?: string,
    @Query('destination') destination?: string
  ): Promise<TripQuote[]> {
    return this.tripsService.findAll();
  }

  @Get(':id')
  async getTripQuoteDetail(@Param('id') id: string): Promise<TripQuote> {
    return this.tripsService.findById(id);
  }

  @Post()
  async createTripQuote(@Body() tripQuoteData: Partial<TripQuote>): Promise<TripQuote> {
    return this.tripsService.create(tripQuoteData);
  }

  @Put(':id')
  async updateTripQuote(
    @Param('id') id: string,
    @Body() tripQuoteData: Partial<TripQuote>
  ): Promise<TripQuote> {
    return this.tripsService.update(id, tripQuoteData);
  }

  @Delete(':id')
  async deleteTripQuote(@Param('id') id: string): Promise<TripQuote> {
    return this.tripsService.delete(id);
  }

  @Get('test/connection')
  async testConnection() {
    console.log('🧪 Testing database connection...');
    try {
      // Try to get the database connection
      const db = (this.tripsService as any).tripQuoteModel.db;
      const collections = await db.listCollections();
      
      console.log('✅ Database connection test successful');
      console.log('📊 Database name:', db.databaseName);
      console.log('📁 Available collections:', collections.map((col: any) => col.name));
      
      return {
        status: 'connected',
        database: db.databaseName,
        collections: collections.map((col: any) => col.name),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return {
        status: 'error',
        error: (error as any).message,
        timestamp: new Date().toISOString()
      };
    }
  }
} 