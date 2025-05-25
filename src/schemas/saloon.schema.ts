import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Saloon extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: String, required: true })
    city: string;

    @Prop({ type: String, required: true })
    place: string; // Place or area within the city

    @Prop({ type: String, required: false })
    latitude: string; // Latitude of the Saloon location

    @Prop({ type: String, required: false })
    longitude: string; // Longitude of the Saloon location

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    owner: Types.ObjectId;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const SaloonSchema = SchemaFactory.createForClass(Saloon);
