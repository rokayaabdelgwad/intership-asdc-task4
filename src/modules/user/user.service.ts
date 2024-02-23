import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { UserDto } from './dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomBadRequestException } from 'src/utils/custom.exceptions';
import * as fs from 'fs';
import * as path from 'path';
import { generateFilename } from "../../utils/imageUpload"; 
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import {  LoggerService } from 'src/modules/logger/logger.service';
import { NationalIDDto } from './dto/nationalId.dto';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerService,
  ) {}
  async createUser(dto: UserDto) {
    try {
      const email = dto.email.toString();
      const hash = await argon.hash(dto.password.toString());
      // Check if a user with the provided email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new CustomBadRequestException(
          `User with email ${email} already exists`,
        );
      }
      // Create the new user if no user with the provided email exists
      const addedUser = await this.prisma.user.create({
        data: {
          email: email,
          hash: hash,
        },
      });
      if (addedUser.hasOwnProperty('hash')) {
        delete (addedUser as any).hash;
      }
      return addedUser;
    } catch (error) {
      if (error instanceof CustomBadRequestException) {
        throw error; // Re-throw the CustomBadRequestException
      } else {
        this.loggerService.logError(error);
        throw new InternalServerErrorException('Error creating user');
      }
    }
  }


  async uploadNationalIdImage(dto: NationalIDDto,file: MemoryStorageFile) {

      const nationalIDImage = generateFilename(file.fieldname).toString();
      const nationalID=dto.nationalID.toString()
      const uploadPath = path.join(__dirname, '..', 'uploads', 'img', nationalIDImage);
      const user = await this.prisma.user.create({
        data:{
          nationalID,
          nationalIDImage
        
        }
      })
      try {
          if (!fs.existsSync(path.dirname(uploadPath))) {
              fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
          }     
          return nationalIDImage;
      } catch (error) {
          this.loggerService.logError(error);
          throw new InternalServerErrorException('Error upload profile picture ');
      }
  }

  async findAllUsers() {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      this.loggerService.logError(error);
      throw new InternalServerErrorException('Error finded  users');
    }
  }

  async findOne(id: number) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return existingUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the CustomBadRequestException
      } else {
        this.loggerService.logError(error);
        throw new InternalServerErrorException('Error finded   user');
      }
    }
  }

  async update(id: number, userData: UpdateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const user = await this.prisma.user.update({
        // lastName:userData.lastName?userData.lastName:existingUser.lastName
        where: { id },
        data: {
          email: userData.email ? userData.email : existingUser.email,
          firstName: userData.firstName
            ? userData.firstName
            : existingUser.firstName,
          lastName: userData.lastName
            ? userData.lastName
            : existingUser.lastName,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the NotFoundException
      } else {
        this.loggerService.logError(error);
        console.error('Error updating user:', error);
        throw new InternalServerErrorException('Error updated user');
      }
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        console.log(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await this.prisma.user.delete({
        where: { id },
      });
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the NotFoundException
      } else {
        this.loggerService.logError(error);
        throw new InternalServerErrorException('Error deleted user');
      }
    }
  }
}
