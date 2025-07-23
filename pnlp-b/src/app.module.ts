import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripsModule } from './trips/trips.module';
import { QuotePricesModule } from './quote-prices/quote-prices.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://DBdelta-Develop:nXsHa0k7lkrravT3@deltaxdb-develop.airpm.mongodb.net/deltafmsQA', {
      // You can add MongoDB connection options here
    }),
    TripsModule,
    QuotePricesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
