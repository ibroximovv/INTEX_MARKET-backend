import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({ example: 'Kimdir' })
    @IsString()
    name: string

    @ApiProperty({ example: '+998910128133' })
    @IsPhoneNumber('UZ')
    @IsString()
    phone: string

    @ApiProperty({ example: 'qayerdir' })
    @IsString()
    adress: string

    @ApiProperty({ example: '1dc7eb6d-9b0e-4bd3-bc87-b62a9b3c1b7a' })
    @IsUUID()
    productsId: string

    @ApiProperty({ example: false })
    @IsBoolean()
    check: boolean
}
