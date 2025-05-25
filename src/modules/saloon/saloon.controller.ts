import { Body, Controller, Get, Post, UseGuards, Request, Query, Patch } from '@nestjs/common';
import { SaloonService } from './saloon.service';
import { AddSaloonEmployeeDto, CreateSaloonDto, PaginationDto } from './dto/create-saloon.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateBookSaloonDto } from './dto/book-saloon.dto';

@Controller('saloon')
export class SaloonController {
  constructor(private readonly saloonService: SaloonService) { }

  // 
  @Post('create')
  async createSaloon(@Body() createSaloonDto: CreateSaloonDto) {
    return this.saloonService.createSaloon(createSaloonDto);
  }


  @UseGuards(AccessTokenGuard)
  @Get('get-all-saloons')
  async getAllSaloons(@Body() paginationDto: PaginationDto) {
    return this.saloonService.getAllSaloons(paginationDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('add-saloon-employee')
  async addSaloonEmployee(@Request() req, @Body() addSaloonEmployeeDto: AddSaloonEmployeeDto) {
    return this.saloonService.addSaloonEmployee(req.user.sub, addSaloonEmployeeDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-saloon-employees')
  async getSaloonEmployees(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.saloonService.getAllEmployees(req.user.sub, paginationDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('book-saloon')
  async bookSaloon(@Request() req, @Body() body: CreateBookSaloonDto) {
    return this.saloonService.bookSaloon(req.user.sub, body);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-my-bookings')
  async getMyBookings(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.saloonService.getMyBookings(req.user.sub, paginationDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-saloon-bookings-employees')
  async getMyBookingsByEmployee(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.saloonService.getMyBookingsByEmployee(req.user.sub, paginationDto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('update-booking-status/:bookingId')
  async updateBookingStatus(@Request() req, @Body() body: { status: string }) {
    return this.saloonService.updateBookingStatus(req.user.sub, req.params.bookingId, body.status);

  }








}
