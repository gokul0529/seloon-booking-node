import { Module } from '@nestjs/common';
import { EmailIntegrationService } from './email-integration.service';
import { EmailIntegrationController } from './email-integration.controller';

@Module({
  controllers: [EmailIntegrationController],
  providers: [EmailIntegrationService],
})
export class EmailIntegrationModule {}
