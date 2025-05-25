import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Booking extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Saloon', required: true })
    saloonId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    employeeId: Types.ObjectId;

    @Prop({ type: Date, required: true })
    bookingDate: Date;

    @Prop({ type: String, required: true })
    bookingStatus: string;

    @Prop({ type: String, required: false })
    name: string;

    @Prop({ type: String, required: false })
    phoneNumber: string;

    @Prop({ type: String, required: false })
    email: string;

    @Prop({ type: String, required: false })
    service: string;

    @Prop({ type: String, required: false })
    notes: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    updatedBy?: Types.ObjectId;

}

export const BookingSchema = SchemaFactory.createForClass(Booking);
