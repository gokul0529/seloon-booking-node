import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class TicketClassification extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
    orgId: Types.ObjectId;
}
export const TicketClassificationSchema = SchemaFactory.createForClass(TicketClassification);
export type TicketClassificationDocument = TicketClassification & Document;