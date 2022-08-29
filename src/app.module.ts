import { Module } from '@nestjs/common';
import { AuthController } from './v1/auth/auth.controller';
import { AuthModule } from './v1/auth/auth.module';
import { HealthModule } from './v1/health/health.module';
import { UsersController } from './v1/users/users.controller';
import { UsersModule } from './v1/users/users.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { HealthController } from './v1/health/health.controller';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
  ],
  controllers: [AuthController, UsersController, HealthController],
  providers: [],
})
export class AppModule {}
