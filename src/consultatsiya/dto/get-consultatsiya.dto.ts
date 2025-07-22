import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class GetConsultatsiyaDto {
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

    @ApiProperty({ required: false, description: 'name, phone' })
    @IsOptional()
    @IsString()
    search?: string

    @ApiProperty({ required: false, enum: ['id', 'name', 'createdAt'] })
    @IsOptional()
    @IsIn(['id', 'name', 'createdAt'])
    sortBy?: 'id' | 'name' | 'createdAt'

    @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc'

    @ApiProperty({ required: false, type: Boolean })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    check?: boolean;
}