import { ApiProperty } from "@nestjs/swagger";
import { StatusENum } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, IsUUID, } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ example: '1dc7eb6d-9b0e-4bd3-bc87-b62a9b3c1b7a' })
    @IsUUID()
    categoryId: string;

    @ApiProperty({ example: 'image.png' })
    @IsString()
    image: string;

    @ApiProperty({ example: 12321 })
    @IsInt()
    @IsPositive()
    price: number;

    @ApiProperty({ example: 100 })
    @IsInt()
    @IsPositive()
    quantity: number;

    @ApiProperty({ example: 'M' })
    @IsString()
    size: string;

    @ApiProperty({ example: 10 })
    @IsInt()
    @IsPositive()
    depth: number;

    @ApiProperty({ example: 10000, required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    discountedPrice?: number;

    @ApiProperty({ example: 'nimadir' })
    @IsString()
    frame_en: string

    @ApiProperty({ example: '', required: false })
    @IsString()
    @IsOptional()
    frame_uz?: string

    @ApiProperty({ example: '', required: false })
    @IsString()
    @IsOptional()
    frame_ru?: string

    @ApiProperty({ enum: StatusENum, required:false, enumName: 'StatusENum' })
    @IsEnum(StatusENum)
    @IsOptional()
    status?: StatusENum
}
