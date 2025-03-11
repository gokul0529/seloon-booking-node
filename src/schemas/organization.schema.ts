import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Organization extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true, unique: true })
    domain: string; // e.g., example.com

    //   @Prop({ type: [{ type: Types.ObjectId, ref: 'Workspace' }] })
    //   workspaces: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Organization Owner
    owner: Types.ObjectId;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
