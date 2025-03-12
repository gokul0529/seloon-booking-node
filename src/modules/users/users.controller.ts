import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDepartmentDto, CreateDesignationDto, CreateRoleDto, CreateUserDto, PaginationDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateOfficeLocationDto } from './dto/create-office-location.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { query } from 'express';

@ApiBearerAuth('defaultBearerAuth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AccessTokenGuard)
  @Post('create-office-location')
  async createOfficeLocation(@Request() req, @Body() createOfficeLocationDto: CreateOfficeLocationDto) {
    return this.usersService.createOfficeLocation(req.user.sub, req.user.orgId, createOfficeLocationDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-office-locations')
  async getOfficeLocations(@Request() req) {
    return this.usersService.getOfficeLocations(req.user.orgId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('create-department')
  async createDepartment(@Request() req, @Body() createDepartmentDto: CreateDepartmentDto) {
    return this.usersService.createDepartment(req.user.sub, req.user.orgId, createDepartmentDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-departments')
  async getDepartments(@Request() req) {
    return this.usersService.getDepartments(req.user.orgId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('create-designation/:departmentId')
  async createDesignation(@Request() req, @Param('departmentId') departmentId: string, @Body() createDesignationDto: CreateDesignationDto) {
    return this.usersService.createDesignation(req.user.sub, req.user.orgId, departmentId, createDesignationDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-designations/:departmentId')
  async getDesignations(@Request() req, @Param('departmentId') departmentId: string) {
    return this.usersService.getDesignations(req.user.orgId, departmentId);
  }

  // roles

  @UseGuards(AccessTokenGuard)
  @Get('get-permissions')
  async getPermissions(@Request() req) {
    return this.usersService.getPermissions(req.user.orgId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('create-role')
  async createRole(@Request() req, @Body() createRoleDto: CreateRoleDto) {
    return this.usersService.createRole(req.user.sub, req.user.orgId, createRoleDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-roles')
  async getRoles(@Request() req) {
    return this.usersService.getRoles(req.user.orgId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('create-user')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new user with avatar' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        employeeId: { type: 'string' },
        officeLocationId: { type: 'string' },
        departmentId: { type: 'string' },
        designationId: { type: 'string' },
        roleId: { type: 'string' },
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'User avatar image'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async createUser(
    @Request() req,
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    return this.usersService.createUser(req.user.sub, req.user.orgId, createUserDto, avatar);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-users')
  async getUsers(@Request() req, @Query() query: PaginationDto) {
    return this.usersService.getUsers(req.user.orgId, query);
  }
}
