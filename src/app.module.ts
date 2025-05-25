import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SeloonModule } from './modules/seloon/seloon.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    SeloonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
