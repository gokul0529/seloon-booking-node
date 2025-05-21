import { Controller } from '@nestjs/common';
import { EmailAuthService } from './email-auth.service';

@Controller('email-auth')
export class EmailAuthController {
  constructor(private readonly emailAuthService: EmailAuthService) { }


}
