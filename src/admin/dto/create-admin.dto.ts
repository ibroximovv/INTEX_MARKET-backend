import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateAdminDto {
    @ApiProperty({ example: 'username' })
    @IsString()
    username: string
    
    @ApiProperty({ example: '1234' })
    @MinLength(4)
    @MaxLength(16)
    @IsString()
    password: string
}