import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from 'src/schemas/organization.schema';
import { S3Service } from '../common/services/s3.service';
import { ConfigModule } from '@nestjs/config'; // Import this
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule, // Add this line
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    JwtModule
  ],
  controllers: [UsersController],
  providers: [UsersService, S3Service],
  exports: [UsersService]
})
export class UsersModule { }