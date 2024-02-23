import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoggerModule } from '../logger/logger.module';
import { StorageModule } from '../storage/storage.module';
@Module({
  // imports:[TypeOrmModule.forFeature([UserDto]),forwardRef(() => PrismaService)],
  imports:[LoggerModule,StorageModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
