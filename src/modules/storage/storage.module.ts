import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageController } from './storage.controller';
import { ProfilePictureService } from './storage.service';
import { LoggerModule } from '../logger/logger.module';
@Module({
    imports:[LoggerModule],
    controllers: [StorageController],
    providers: [ProfilePictureService, PrismaService],
})
export class StorageModule {}
