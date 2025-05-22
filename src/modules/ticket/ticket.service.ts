import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ticket, TicketDocument } from 'src/schemas/ticket.schema';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) { }
  async create(userId: string, orgId: string, createTicketDto: CreateTicketDto) {
    const ticket = new this.ticketModel({
      ...createTicketDto,
      createdBy: new Types.ObjectId(userId),
      orgId: new Types.ObjectId(orgId),
    });
    await ticket.save();

    return {
      message: 'Ticket created successfully',
      data: ticket,
    }
  }

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
