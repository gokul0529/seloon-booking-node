import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { IsArray, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export enum UserType {
    ROOT = 'root',
    ADMIN = 'admin',
    USER = 'user',
}

// Define the Permission schema as a sub-document
export class Permission {
    @Prop({ required: true })
    aclKey: string;

    @Prop({ required: true })
    label: string;
}

// Define the PermissionCollection schema to group permissions by category
export class PermissionCollection {
    @Prop({ required: true })
    category: string;

    @Prop({ type: [Permission], default: [] })
    permissions: Permission[];
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    avatarUrl: string;

    @Prop({ required: false })
    password: string;


    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Prop({ type: String, enum: UserType, default: UserType.USER })
    userType: UserType

    @Prop()
    otp: string;

    @Prop({ type: Object })
    permissions: any;

    @Prop({ type: String, unique: true, required: false })
    uniqueCode: string;

    @Prop({ type: Number, default: 0 })
    notificationCount: number;

    @Prop()
    refreshToken: string;

    @Prop({ type: Types.ObjectId, ref: 'Company', required: false })
    companyId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    ownedBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy: Types.ObjectId;

    @Prop({ type: String, required: false })
    firebaseToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
