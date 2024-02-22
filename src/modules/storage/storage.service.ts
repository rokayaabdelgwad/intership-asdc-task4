
import { PrismaService } from "../prisma/prisma.service";
import { Injectable, InternalServerErrorException, NotFoundException, } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';
import { generateFilename } from "src/utils/imageUpload";
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { CustomBadRequestException } from 'src/utils/custom.exceptions';
import {  LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class ProfilePictureService {
    constructor(private readonly loggerService: LoggerService){}
    async uploadProfilePicture(file: MemoryStorageFile): Promise<string> {
        const filename = generateFilename(file.fieldname);
        const uploadPath = path.join(__dirname, '..', 'uploads', 'img', filename);
        
        try {
            if (!fs.existsSync(path.dirname(uploadPath))) {
                fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
            }     
            return filename;
        } catch (error) {
            this.loggerService.logError(error);
            throw new InternalServerErrorException('Error upload profile picture ');
        }
    }
}
// @Injectable()
// export class NationalIdService {
//     constructor(private prisma: PrismaService ,private readonly loggerService: LoggerService) { }
//     async uploadNationalId(userId: number, file:MemoryStorageFile) {
//         try {
//             await this.prisma.user.update({
//                 where: { id: userId },
//                 data: { nationalIDImage: file }
//             })
//         } catch (error) {
//             throw new Error(`Error uploading national ID image: ${error.message}`);
//         }
//     }

    // async getNationalId(userId: number): Promise<Buffer | null> {
    //     try {
    //         const user = await this.prisma.user.findUnique({
    //             where: { id: userId },
    //             select: { nationalIDImage: true },
    //         })
    //         return user?.nationalIDImage || null;
    //     } catch (error) {
    //         throw new Error(`Error retrieving national ID image: ${error.message}`);
    //     }
    // }}
