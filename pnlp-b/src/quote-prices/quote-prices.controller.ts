import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { QuotePricesService } from './quote-prices.service';
import { QuotePrice } from '../schemas/quote-price.schema';
import { CollectionInfo, DatabaseError } from '../types';

@Controller('quotes')
export class QuotePricesController {
  constructor(private readonly quotePricesService: QuotePricesService) {}

  @Get()
  async getQuotePrices(
    @Query('status') status?: string,
    @Query('destination') destination?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('tripQuoteId') tripQuoteId?: string
  ): Promise<QuotePrice[]> {
    
    if (status) {
      return this.quotePricesService.findByStatus(status);
    }
    if (destination) {
      return this.quotePricesService.findByDestination(destination);
    }
    if (minPrice && maxPrice) {
      return this.quotePricesService.findByPriceRange(Number(minPrice), Number(maxPrice));
    }
    if (tripQuoteId) {
      return this.quotePricesService.findByTripQuoteId(tripQuoteId);
    }
    
    return this.quotePricesService.findAll();
  }

  @Get(':id')
  async getQuotePriceDetail(@Param('id') id: string): Promise<QuotePrice> {
    return this.quotePricesService.findById(id);
  }

  @Post()
  async createQuotePrice(@Body() quotePriceData: Partial<QuotePrice>): Promise<QuotePrice> {
    return this.quotePricesService.create(quotePriceData);
  }

  @Put(':id')
  async updateQuotePrice(
    @Param('id') id: string,
    @Body() quotePriceData: Partial<QuotePrice>
  ): Promise<QuotePrice> {
    return this.quotePricesService.update(id, quotePriceData);
  }

  @Delete(':id')
  async deleteQuotePrice(@Param('id') id: string): Promise<QuotePrice> {
    return this.quotePricesService.delete(id);
  }

  @Get('test/connection')
  async testConnection() {
    console.log('🧪 Testing quotePrices database connection...');
    try {
      // Try to get the database connection
      const db = (this.quotePricesService as unknown as { quotePriceModel: { db: { databaseName: string; listCollections(): Promise<CollectionInfo[]> } } }).quotePriceModel.db;
      const collections = await db.listCollections();
      
      console.log('✅ Database connection test successful');
      console.log('📊 Database name:', db.databaseName);
      console.log('📁 Available collections:', collections.map((col: CollectionInfo) => col.name));
      
      return {
        status: 'connected',
        database: db.databaseName,
        collections: collections.map((col: CollectionInfo) => col.name),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return {
        status: 'error',
        error: (error as DatabaseError).message,
        timestamp: new Date().toISOString()
      };
    }
  }
} 