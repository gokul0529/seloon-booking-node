import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOfficeLocationDto } from './dto/create-office-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { OfficeLocation } from 'src/schemas/office-location.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(OfficeLocation.name) private officeLocationModel: Model<OfficeLocation>
  ) { }

  async createOfficeLocation(userId: string, orgId: string, createOfficeLocationDto: CreateOfficeLocationDto) {
    const officeLocation = await this.officeLocationModel.create({
      ...createOfficeLocationDto,
      createdBy: new Types.ObjectId(userId),
      orgId: new Types.ObjectId(orgId)
    });

    return {
      message: 'Office location created successfully',
      data: officeLocation
    }

  }

  async getOfficeLocations(orgId: string) {
    const officeLocations = await this.officeLocationModel.find({ orgId: new Types.ObjectId(orgId), isActive: true }).lean();
    return {
      message: 'Office locations fetched successfully',
      data: officeLocations
    }
  }
}
