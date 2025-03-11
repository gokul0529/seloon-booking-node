import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IsArray, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';

export enum UserType {
    ROOT = 'root',
    ADMIN = 'admin',
    USER = 'user',
}

// // Define the Permission schema
// export class Permission {
//     @Prop({ required: true })
//     aclKey: string;

//     @Prop({ required: true })
//     label: string;
// }

// // Define the PermissionCollection schema
// export class PermissionCollection {
//     @Prop({ required: true })
//     category: string;

//     @Prop({ type: [Permission], default: [] })
//     permissions: Permission[];
// }

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    _id: string;

    @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
    orgId: Types.ObjectId;

    @Prop({ required: true, unique: true, lowercase: true })
    @IsNotEmpty({ message: 'Please provide your email' })
    @IsEmail({}, { message: 'Please provide a valid email' })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    avatarUrl?: string;

    @Prop({ required: false, select: false }) // Hide password in queries
    password?: string;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Prop({ type: String, enum: UserType, default: UserType.USER })
    userType: UserType;

    @Prop({ type: Types.ObjectId, ref: 'Role' })
    roleId?: Types.ObjectId;

    @Prop({ select: false })
    otp?: string;

    // @Prop({ type: [PermissionCollection], default: [] })
    // permissions: PermissionCollection[];

    @Prop({ type: String, unique: true })
    uniqueCode?: string;

    @Prop({ type: Number, default: 0 })
    notificationCount: number;

    @Prop({ select: false }) // Hide refreshToken in queries
    refreshToken?: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    ownedBy?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy?: Types.ObjectId;

    @Prop()
    firebaseToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook for email lowercasing & optional password hashing
UserSchema.pre<UserDocument>('save', async function (next) {
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase();
    }

    if (this.isModified('password') && this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});
