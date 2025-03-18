import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from 'src/schemas/organization.schema';
import { Role, RoleSchema } from 'src/schemas/role.schema';
import { OfficeLocation, OfficeLocationSchema } from 'src/schemas/office-location.schema';
import { Department, DepartmentSchema } from 'src/schemas/department.schema';
import { Designation, DesignationSchema } from 'src/schemas/designation.schema';
import { S3Service } from '../common/services/s3.service';
import { ConfigModule } from '@nestjs/config'; // Import this
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule, // Add this line
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Role.name, schema: RoleSchema },
      { name: OfficeLocation.name, schema: OfficeLocationSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Designation.name, schema: DesignationSchema },
    ]),
    JwtModule
  ],
  controllers: [UsersController],
  providers: [UsersService, S3Service],
  exports: [UsersService]
})
export class UsersModule { }