import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum Severity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum Status {
    OPEN = 'open',
    REOPENED = 'reopened',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

export enum Channel {
    EMAIL = 'email',
    CHAT = 'chat',
}

export enum WorkType {
    ONSITE = 'onsite',
    REMOTE = 'remote',
    SELF_SERVICE = 'self_service',
    OTHER = 'other',
}

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket extends Document {

    @Prop({ type: String, default: 'D-3-T1198' })
    uniqueCode: string;

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
    contactPersonName: string;

    @Prop({ type: String })
    email: string;

    @Prop({ type: String })
    phone: string;

    @Prop({ type: String, enum: Channel, default: Channel.EMAIL })
    channel: Channel;

    @Prop({ type: String, enum: WorkType, default: WorkType.REMOTE })
    workType: WorkType;

    @Prop({ type: String, enum: Status, default: Status.OPEN })
    status: Status;

    @Prop({ type: String, enum: Priority, default: Priority.LOW })
    priority: Priority;

    @Prop({ type: String, enum: Severity, default: Severity.LOW })
    severity: Severity;

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

export const TicketSchema = SchemaFactory.createForClass(Ticket);