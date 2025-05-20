import { Controller } from '@nestjs/common';
import { EmailIntegrationService } from './email-integration.service';

@Controller('email-integration')
export class EmailIntegrationController {
  constructor(private readonly emailIntegrationService: EmailIntegrationService) {}
}
