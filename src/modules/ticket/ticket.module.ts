import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from 'src/schemas/ticket.schema';
import { Customer, CustomerSchema } from 'src/schemas/customer.schema';
import { TicketClassification, TicketClassificationSchema } from 'src/schemas/ticket-classification';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Ticket.name, schema: TicketSchema },
    { name: Customer.name, schema: CustomerSchema },
    { name: TicketClassification.name, schema: TicketClassificationSchema }
  ])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule { }
