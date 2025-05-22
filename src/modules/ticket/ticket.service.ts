import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ticket, TicketDocument } from 'src/schemas/ticket.schema';
import { GetTicketDto } from './dto/get-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) { }
  async createTicket(userId: string, orgId: string, createTicketDto: CreateTicketDto) {
    const assignedTo = createTicketDto.assignedTo.map((id) => new Types.ObjectId(id));

    const ticket = new this.ticketModel({
      ...createTicketDto,
      ticketClassification: new Types.ObjectId(createTicketDto.ticketClassificationId),
      customerId: new Types.ObjectId(createTicketDto.customerId),
      createdBy: new Types.ObjectId(userId),
      orgId: new Types.ObjectId(orgId),
      assignedTo,
    });
    await ticket.save();

    return {
      message: 'Ticket created successfully',
      data: ticket,
    }
  }

  async findAllTickets(userId: string, orgId: string, getTicketDto: GetTicketDto) {
    const { search, status, priority, severity } = getTicketDto;
    const page = +getTicketDto.page || 1;
    const limit = +getTicketDto.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = {
      orgId: new Types.ObjectId(orgId),
      ...(search && { name: { $regex: search, $options: 'i' } }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(severity && { severity }),
    };

    const tickets = await this.ticketModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate('customerId', 'name')
      .populate('ticketClassificationId', 'name')
      .populate('assignedTo', 'name email avatarUrl')
      .populate('createdBy', 'name email avatarUrl');

    const total = await this.ticketModel.countDocuments(query);

    return {
      message: 'Tickets fetched successfully',
      data: tickets,
      total,
    }

  }

  async findTicketById(id: string) {
    const ticket = await this.ticketModel
      .findById(id)
      .populate('customerId', 'name')
      .populate('ticketClassificationId', 'name')
      .populate('assignedTo', 'name email avatarUrl')
      .populate('createdBy', 'name email avatarUrl')

    return {
      message: 'Ticket fetched successfully',
      data: ticket,
    }

  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
