import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetTicketDto } from './dto/get-ticket.dto';
@ApiBearerAuth('defaultBearerAuth')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }


  @UseGuards(AccessTokenGuard)
  @Post('create')
  create(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket(req.user.sub, req.user.orgId, createTicketDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-all')
  findAll(@Request() req, @Query() getTicketDto: GetTicketDto) {
    return this.ticketService.findAllTickets(req.user.sub, req.user.orgId, getTicketDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findTicketById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }


}
