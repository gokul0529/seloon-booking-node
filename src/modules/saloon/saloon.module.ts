import { Module } from '@nestjs/common';
import { SaloonService } from './saloon.service';
import { SaloonController } from './saloon.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { Saloon, SaloonSchema } from 'src/schemas/saloon.schema';
import { Booking, BookingSchema } from 'src/schemas/booking.schema';

@Module({
  imports: [
    ConfigModule, // Add this line
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Saloon.name, schema: SaloonSchema },
      { name: Booking.name, schema: BookingSchema }
    ]),
  ],
  controllers: [SaloonController],
  providers: [SaloonService],
})
export class SaloonModule { }
