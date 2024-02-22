import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { CustomBadRequestException } from 'src/utils/custom.exceptions';
import { InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/modules/logger/logger.service';
// /src/prisma/prisma.service
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
    private readonly LoggerService: LoggerService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      const email = dto.email.toString();
      const hash = await argon.hash(dto.password.toString());

      // Check if a user with the provided email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: email },
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
        this.LoggerService.logError(error);
        throw new InternalServerErrorException('Error creating user');
      }
    }
  }
  async signin(dto: AuthDto) {
    const email = dto.email.toString();
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // if user is not exist throw exception
    if (!user) {
      throw new ForbiddenException('the user does not exist');
    }

    // compare the password
    const pwMatches = await argon.verify(
      user.hash.toString(),
      dto.password.toString(),
    );
    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException(' incorrect password');
    // send back the user

    return this.signToken(user.id, user.email);
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: String }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
