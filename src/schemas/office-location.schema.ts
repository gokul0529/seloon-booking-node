import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class OfficeLocation extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    address: string;

    @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
    orgId: Types.ObjectId;

    @Prop({ default: true })
    isActive: boolean;
}
export const OfficeLocationSchema = SchemaFactory.createForClass(OfficeLocation);