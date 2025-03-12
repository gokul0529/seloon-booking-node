import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto, CreateDesignationDto, CreateRoleDto, CreateUserDto, PaginationDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOfficeLocationDto } from './dto/create-office-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { OfficeLocation } from 'src/schemas/office-location.schema';
import { Department } from 'src/schemas/department.schema';
import { Designation } from 'src/schemas/designation.schema';
import { Role } from 'src/schemas/role.schema';
import * as fs from 'fs';
import { S3Service } from '../common/services/s3.service';

@Injectable()
export class UsersService {
  private permissionsFile = './src/modules/auth/permissions/permissions.json';
  private permissions: any[];
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(OfficeLocation.name) private officeLocationModel: Model<OfficeLocation>,
    @InjectModel(Department.name) private departmentModel: Model<Department>,
    @InjectModel(Designation.name) private designationModel: Model<Designation>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private readonly s3Service: S3Service
  ) {
    try {
      const fileContent = fs.readFileSync(this.permissionsFile, 'utf8');
      this.permissions = JSON.parse(fileContent);
    } catch (error) {
      throw new Error(error);
    }
  }

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

  async createDepartment(userId: string, orgId: string, createDepartmentDto: CreateDepartmentDto) {
    const department = await this.departmentModel.create({
      ...createDepartmentDto,
      createdBy: new Types.ObjectId(userId),
      orgId: new Types.ObjectId(orgId)
    });

    return {
      message: 'Department created successfully',
      data: department
    }
  }

  async getDepartments(orgId: string) {
    const departments = await this.departmentModel.find({ orgId: new Types.ObjectId(orgId), isActive: true }).lean();
    return {
      message: 'Departments fetched successfully',
      data: departments
    }
  }

  async createDesignation(userId: string, orgId: string, departmentId: string, createDesignationDto: CreateDesignationDto) {
    const designation = await this.designationModel.create({
      ...createDesignationDto,
      createdBy: new Types.ObjectId(userId),
      orgId: new Types.ObjectId(orgId),
      departmentId: new Types.ObjectId(departmentId)
    });

    return {
      message: 'Designation created successfully',
      data: designation
    }
  }

  async getDesignations(orgId: string, departmentId: string) {
    const designations = await this.designationModel.find({ orgId: new Types.ObjectId(orgId), departmentId: new Types.ObjectId(departmentId), isActive: true }).lean();
    return {
      message: 'Designations fetched successfully',
      data: designations
    }
  }

  async getPermissions(orgId: string) {
    return {
      message: 'Permissions fetched successfully',
      data: this.permissions
    }
  }

  async createRole(userId: string, orgId: string, createRoleDto: CreateRoleDto) {
    const role = await this.roleModel.create({
      ...createRoleDto,
      createdBy: new Types.ObjectId(userId),
      orgId: new Types.ObjectId(orgId)
    });

    return {
      message: 'Role created successfully',
      data: role
    }
  }

  async getRoles(orgId: string) {
    const roles = await this.roleModel.find({ orgId: new Types.ObjectId(orgId), isActive: true }).lean();
    return {
      message: 'Roles fetched successfully',
      data: roles
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
      departmentId: createUserDto.departmentId ? new Types.ObjectId(createUserDto.departmentId) : null,
      designationId: createUserDto.designationId ? new Types.ObjectId(createUserDto.designationId) : null,
      roleId: new Types.ObjectId(createUserDto.roleId),
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
}
