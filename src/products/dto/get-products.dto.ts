import { ApiProperty } from "@nestjs/swagger";
import { StatusENum } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class GetProductsDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @IsInt()
    skip?: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @IsInt()
    take?: number

    @ApiProperty({ required: false, description: 'frame_en, frame_ru, frame_uz, price' })
    @IsOptional()
    @IsString()
    search?: string

    @ApiProperty({ required: false, enum: ['id', 'createdAt', 'price', 'quantity', 'depth'] })
    @IsOptional()
    @IsIn(['id', 'createdAt', 'price', 'quantity', 'depth'])
    sortBy?: 'id' | 'createdAt' | 'price' | 'quantity' | 'depth'

    @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc'

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: UUID

    @ApiProperty({ required: false, enum: StatusENum, enumName: 'StatusENum' })
    @IsOptional()
    @IsEnum(StatusENum)
    status?: StatusENum;
}