import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class Permission {
    @Prop({ required: true })
    aclKey: string; // Unique key for permission, e.g., "project:create.any"

    @Prop({ required: true })
    label: string; // Display name for the permission, e.g., "Create Project"
}

export class PermissionCollection {
    @Prop({ required: true })
    category: string; // e.g., "Project Management"

    @Prop({ type: [Permission], default: [] })
    permissions: Permission[];
}

@Schema({ timestamps: true })
export class Role extends Document {
    @Prop({ required: true })
    name: string; // e.g., "Admin", "Manager", "User"

    @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
    orgId: Types.ObjectId;

    @Prop({ type: [PermissionCollection], default: [] })
    permissions: PermissionCollection[];

    @Prop({ default: true })
    isActive: boolean;
}


export const RoleSchema = SchemaFactory.createForClass(Role);
// Ensure uniqueness of role name per organization
RoleSchema.index({ name: 1, organizationId: 1 }, { unique: true });