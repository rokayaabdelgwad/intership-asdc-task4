import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { LoggerModule } from './modules/logger/logger.module';
import { StorageModule } from './modules/storage/storage.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),AuthModule,LoggerModule,StorageModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class AppModule {}
