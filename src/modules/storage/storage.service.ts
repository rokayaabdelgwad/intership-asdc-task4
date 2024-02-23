
import { PrismaService } from "../prisma/prisma.service";
import { Injectable, InternalServerErrorException, NotFoundException, } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';
import { generateFilename } from '../../utils/imageUpload';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { CustomBadRequestException } from 'src/utils/custom.exceptions';
import {  LoggerService } from '../logger/logger.service';
import * as multer from 'multer';
import { NationalIDDto } from "../user/dto/nationalId.dto";
// Set up Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
@Injectable()

export class storageService {
    [x: string]: any;
    constructor(private readonly prisma: PrismaService,private readonly loggerService: LoggerService){}

    async uploadProfilePicture(file: MemoryStorageFile) {
 const profile_pic = generateFilename(file.fieldname).toString();
        
        const uploadPath = path.join(__dirname, '..', 'uploads', 'img', profile_pic);
        const user = await this.prisma.user.create({
          data:{
           profile_pic
          
          }
        })
        try {
            if (!fs.existsSync(path.dirname(uploadPath))) {
                fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
            }     
            return {'profile_pic':user.profile_pic};
        } catch (error) {
            this.loggerService.logError(error);
            throw new InternalServerErrorException('Error upload profile picture ');
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            return {'nationalID':user.nationalID,"nationalIDImage":user.nationalIDImage};
        } catch (error) {
            this.loggerService.logError(error);
            throw new InternalServerErrorException('Error upload profile picture ');
        }
    }
  

}

