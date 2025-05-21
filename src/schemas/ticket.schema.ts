import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class Ticket extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
    orgId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Customer', })
    customerId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    contactPersonId: Types.ObjectId;

    @Prop({ type: String })
    email: string;

    @Prop({ type: String })
    phone: string;

    @Prop({ type: String })
    workType: string;

    @Prop({ type: String })
    status: string;

    @Prop({ type: String })
    priority: string;

    @Prop({ type: String })
    severity: string;

    @Prop({ type: Types.ObjectId, ref: 'TicketClassification' })
    ticketClassificationId: Types.ObjectId;

    @Prop({ type: Date })
    dueDate: Date;

    @Prop({ type: [Types.ObjectId], ref: 'User', required: true, index: true })
    assignedTo: Types.ObjectId[];

    @Prop({ type: [String], })
    tags: string[];

    @Prop({ type: [String], })
    attachments: string[];


}