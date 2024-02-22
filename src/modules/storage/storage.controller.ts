import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProfilePictureService } from './storage.service';
@Controller()
export class StorageController {
  constructor(private readonly storageService: ProfilePictureService) {}

  @Post('upload-profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/img',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    const result = await this.storageService.uploadProfilePicture(file);
    return {
      statusCode: 200,
      data: result,
    };
  }
}


//     @Post('upload-national-id')
//     async uploadNationalId(
//         @Body('userId') userId: number,
//         @Body('image') image: Buffer
//     ): Promise<void> {
//         await this.nationalIdService.uploadNationalId(userId, image);
//     }

//     @Get('get-national-id')
//     async getNationalId(@Query('userId') userId: number): Promise<Buffer | null> {
//         return this.nationalIdService.getNationalId(userId);
// }}