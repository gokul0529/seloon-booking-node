import { Module } from '@nestjs/common';
import { SeloonService } from './seloon.service';
import { SeloonController } from './seloon.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Seloon, SeloonSchema } from 'src/schemas/seloon.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule, // Add this line
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Seloon.name, schema: SeloonSchema },
    ]),
    JwtModule
  ],
  controllers: [SeloonController],
  providers: [SeloonService],
})
export class SeloonModule { }
