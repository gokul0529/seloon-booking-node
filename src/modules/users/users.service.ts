import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto, CreateDesignationDto, CreateUserDto, PaginationDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserType } from 'src/schemas/user.schema';
import * as fs from 'fs';
import { S3Service } from '../common/services/s3.service';

@Injectable()
export class UsersService {
  private permissionsFile = './src/modules/auth/permissions/permissions.json';
  private permissions: any[];
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly s3Service: S3Service
  ) {
    try {
      const fileContent = fs.readFileSync(this.permissionsFile, 'utf8');
      this.permissions = JSON.parse(fileContent);
    } catch (error) {
      throw new Error(error);
    }
  }




  async getPermissions(orgId: string) {
    return {
      message: 'Permissions fetched successfully',
      data: this.permissions
    }
  }



  async createUser(userId: string, orgId: string, createUserDto: CreateUserDto, avatar: Express.Multer.File) {

    // Upload avatar to S3 if provided
    let avatarUrl: any = null
    if (avatar != null && avatar && avatar?.size > 0) {
      const timestamp = Date.now();
      const originalFileName = avatar.originalname;
      const FileName = `${timestamp}_${originalFileName}`;
      const folder = `avatars/${orgId}`;
      avatarUrl = await this.s3Service.uploadFile(avatar, folder, FileName);
    }
    const user = await this.userModel.create({
      ...createUserDto,
      createdBy: new Types.ObjectId(userId),
      orgId: new Types.ObjectId(orgId),
      avatarUrl: avatarUrl
    });

    return {
      message: 'User created successfully',
      data: user
    }
  }

  async getUsers(orgId: string, query: PaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const users = await this.userModel.find({ orgId: new Types.ObjectId(orgId), isActive: query.isActive }).select('id name email avatarUrl').skip(skip).limit(limit).lean();
    const total = await this.userModel.countDocuments({ orgId: new Types.ObjectId(orgId), isActive: query.isActive });
    return {
      message: 'Users fetched successfully',
      data: users,
      total,
    }
  }

  async getUser(orgId: string, userId: string) {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId), orgId: new Types.ObjectId(orgId) }).lean();
    return {
      message: 'User fetched successfully',
      data: user
    }
  }

  async profileView(orgId: string, userId: string) {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId), orgId: new Types.ObjectId(orgId)
    })
      .select('_id name avatarUrl isActive email employeeId lastActiveAt')
      .populate('roleId', 'name _id').lean();
    return {
      message: 'User fetched successfully',
      data: user
    }
  }

  async updateUser(loginUserId: string, orgId: string, userId: string, updateUserDto: UpdateUserDto, avatar: Express.Multer.File) {
    // Upload avatar to S3 if provided


    const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId), orgId: new Types.ObjectId(orgId) });
    if (!user) {
      throw new Error('User not found');
    }
    if (avatar != null && avatar && avatar?.size > 0) {
      const timestamp = Date.now();
      const originalFileName = avatar.originalname;
      const FileName = `${timestamp}_${originalFileName}`;
      const folder = `avatars/${orgId}`;
      user.avatarUrl = await this.s3Service.uploadFile(avatar, folder, FileName);
    }


    const updatedValue = await this.userModel.findOneAndUpdate({ _id: new Types.ObjectId(userId), orgId: new Types.ObjectId(orgId) },
      { ...updateUserDto, avatarUrl: user.avatarUrl }, { new: true }).lean();

    return {
      message: 'User updated successfully',
      data: updatedValue
    }

  }

  async deleteUser(loginUserId: string, orgId: string, userId: string) {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId), orgId: new Types.ObjectId(orgId) });
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = true;
    user.isDeleted = true;
    user.updatedBy = new Types.ObjectId(loginUserId);
    await user.save();
    return {
      message: 'User deleted successfully',
      // data: user
    }

  }

  async deactivateUser(loginUserId: string, orgId: string, userId: string) {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId), orgId: new Types.ObjectId(orgId) });
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = false;
    user.updatedBy = new Types.ObjectId(loginUserId);
    await user.save();
    return {
      message: 'User deactivated successfully',
      data: user
    }

  }

  async userSignup(CreateUserDto: CreateUserDto) {
    const existEmail = await this.userModel.findOne({ email: CreateUserDto.email });
    if (existEmail) {
      throw new Error('Email already exists');
    }
    const user = await this.userModel.create({ ...CreateUserDto, userType: UserType.USER });
    return {
      message: 'User created successfully',
      data: user
    }


  }
}
