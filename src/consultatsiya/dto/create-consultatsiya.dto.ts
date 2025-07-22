import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateConsultatsiyaDto {
    @ApiProperty({ example: 'name' })
    @IsString()
    name: string

    @ApiProperty({ example: '+998910000101' })
    @IsPhoneNumber('UZ')
    @IsString()
    phone: string

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    check?: boolean
}
