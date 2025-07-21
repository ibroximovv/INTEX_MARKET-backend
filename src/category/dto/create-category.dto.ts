import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({ example: 'nimadir' })
    @IsString()
    name: string

    @ApiProperty({ example: 'nimadir', required: false })
    @IsOptional()
    @IsString()
    name_en?: string

    @ApiProperty({ example: '', required: false })
    @IsString()
    @IsOptional()
    name_uz?: string

    @ApiProperty({ example: '', required: false })
    @IsString()
    @IsOptional()
    name_ru?: string
}
