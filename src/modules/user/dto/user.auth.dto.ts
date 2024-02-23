import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString,IsNumber, IsPositive, IsNotEmpty, IsEmail } from 'class-validator';

export class UserDto {
    constructor(email: string, password: string, firstName: string) {
        this.email = email;
        this.password = password;
        
    }
   
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

	@IsString()
    @IsNotEmpty()
    readonly password:string
    


    
}
