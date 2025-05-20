import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmailIntegrationModule } from './modules/email-integration/email-integration.module';
import { EmailAuthModule } from './modules/email-auth/email-auth.module';
import { TicketModule } from './modules/ticket/ticket.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    EmailIntegrationModule,
    EmailAuthModule,
    TicketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
