import { Controller, Get, Post,  Delete, Param, Body,   UseInterceptors,  UploadedFile, Patch, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { NationalIDDto } from './dto/nationalId.dto';
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
   createUser(@Body() dot:UserDto){
    return this.userService.createUser(dot);
  }
  @Post('upload-nationalId-image')
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
  uploadNationalIdImage(@UploadedFile(  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 200000 }),
      new FileTypeValidator({ fileType: 'image/jpeg' }),
    ],
  })) file: Express.Multer.File,@Body() dto: NationalIDDto ) {
    return this.userService.uploadNationalIdImage(dto,file); // Call the correct method from the userService
  }
  @Get('get-all-users')
  @ApiOperation({summary:"Get all users from this api"})
  @ApiResponse({status:200,description:"All users List "})
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get('get-user/:id')
   findOneUser(@Param('id') id: string) {
     return this.userService.findOne(parseInt(id, 10));
  
  }
  
  @Patch('update-user/:id')
   updateUser(@Param('id') id: string, @Body() bodyData: UpdateUserDto){
    return this.userService.update(parseInt(id, 10), bodyData);
  }

  @Delete('delete-user/:id')
    deleteUser(@Param('id') id: string){
    return this.userService.deleteUser(parseInt(id, 10));
  }}