import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuotePricesController } from './quote-prices.controller';
import { QuotePricesService } from './quote-prices.service';
import { QuotePrice, QuotePriceSchema } from '../schemas/quote-price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QuotePrice.name, schema: QuotePriceSchema }])
  ],
  controllers: [QuotePricesController],
  providers: [QuotePricesService],
  exports: [QuotePricesService]
})
export class QuotePricesModule {} 