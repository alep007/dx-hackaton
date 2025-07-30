import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripsModule } from './trips/trips.module';
import { QuotePricesModule } from './quote-prices/quote-prices.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-app', {
      // You can add MongoDB connection options here
    }),
    TripsModule,
    QuotePricesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
