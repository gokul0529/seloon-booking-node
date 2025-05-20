import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum EmailProvider {
    GOOGLE = 'google',
    MICROSOFT365 = 'microsoft365'
}


@Schema({ timestamps: true })
export class EmailConnection extends Document {


    @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
    orgId: Types.ObjectId;

    @Prop({ required: true, enum: EmailProvider })
    provider: EmailProvider;

    @Prop({ required: true })
    email: string;

    @Prop({
        type: {
            refreshToken: { type: String, required: true }, // Encrypted
            accessToken: { type: String }, // Encrypted
            expiresAt: { type: Date },
            lastRefreshed: { type: Date }
        }
    })
    oauthCredentials: {
        refreshToken: string;
        accessToken?: string;
        expiresAt: Date;
        lastRefreshed: Date;
    };

    @Prop({
        type: {
            imapServer: String,
            imapPort: Number,
            smtpServer: String,
            smtpPort: Number,
            requiresSSL: Boolean
        }
    })
    customProviderConfig?: {
        imapServer?: string;
        imapPort?: number;
        smtpServer?: string;
        smtpPort?: number;
        requiresSSL?: boolean;
    };


    @Prop({})
    lastError?: string;

    @Prop({ default: 0 })
    retryAttempts: number;

    @Prop({ default: true })
    isActive: boolean;
}
export const EmailConnectionSchema = SchemaFactory.createForClass(EmailConnection);