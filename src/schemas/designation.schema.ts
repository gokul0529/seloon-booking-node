import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class Designation extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'Department', required: true, index: true })
    departmentId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
    orgId: Types.ObjectId;

    @Prop({ default: true })
    isActive: boolean;
}
export const DesignationSchema = SchemaFactory.createForClass(Designation);