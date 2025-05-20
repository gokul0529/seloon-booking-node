import { Module } from '@nestjs/common';
import { EmailAuthService } from './email-auth.service';
import { EmailAuthController } from './email-auth.controller';

@Module({
  controllers: [EmailAuthController],
  providers: [EmailAuthService],
})
export class EmailAuthModule {}
