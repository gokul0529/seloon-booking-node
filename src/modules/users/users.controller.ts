import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDepartmentDto, CreateDesignationDto, CreateUserDto, PaginationDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorator/permissions.decorator';

@ApiBearerAuth('defaultBearerAuth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }



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
        isActive: { type: 'boolean' },
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

  @UseGuards(AccessTokenGuard)
  @Get('get-user/:userId')
  async getUser(@Request() req, @Param('userId') userId: string) {
    return this.usersService.getUser(req.user.orgId, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile/:userId')
  async profileView(@Request() req, @Param('userId') userId: string) {
    return this.usersService.profileView(req.user.orgId, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('update-user/:userId')
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
        isActive: { type: 'boolean' },
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'User avatar image'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(@Request() req,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    return this.usersService.updateUser(req.user.sub, req.user.orgId, userId, updateUserDto, avatar);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('delete-user/:userId')
  async deleteUser(@Request() req, @Param('userId') userId: string) {
    return this.usersService.deleteUser(req.user.sub, req.user.orgId, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('deactivate-user/:userId')
  async deactivateUser(@Request() req, @Param('userId') userId: string) {
    return this.usersService.deactivateUser(req.user.sub, req.user.orgId, userId);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.userSignup(createUserDto);
  }
}
