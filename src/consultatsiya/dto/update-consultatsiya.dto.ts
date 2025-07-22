import { PartialType } from '@nestjs/swagger';
import { CreateConsultatsiyaDto } from './create-consultatsiya.dto';

export class UpdateConsultatsiyaDto extends PartialType(CreateConsultatsiyaDto) {}
