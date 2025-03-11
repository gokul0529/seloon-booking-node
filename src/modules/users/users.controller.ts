import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateOfficeLocationDto } from './dto/create-office-location.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

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
}
