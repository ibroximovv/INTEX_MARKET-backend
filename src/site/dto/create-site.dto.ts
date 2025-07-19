import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsPhoneNumber, IsString } from "class-validator"

export class CreateSiteDto {
    @ApiProperty({ example: '+998910128133' })
    @IsPhoneNumber('UZ')
    @IsString()
    phone: string

    @ApiProperty({ example: 'qayerdir' })
    @IsString()
    adress_en: string

    @ApiProperty({ example: 'qayerdir2', required: false })
    @IsOptional()
    @IsString()
    adress_uz?: string

    @ApiProperty({ example: 'qayerdir2', required: false })
    @IsOptional()
    @IsString()
    adress_ru?: string

    @ApiProperty({ example: 'asdasn adlkasnn asdkln' })
    @IsString()
    workingHours: string

    @ApiProperty({ example: 'https://telegram.org' })
    @IsString()
    telegramLink: string

    @ApiProperty({ example: 'https://telegram.org' })
    @IsString()
    instagramLink: string
}
