import { Module } from '@nestjs/common';
import { ConsultatsiyaService } from './consultatsiya.service';
import { ConsultatsiyaController } from './consultatsiya.controller';

@Module({
  controllers: [ConsultatsiyaController],
  providers: [ConsultatsiyaService],
})
export class ConsultatsiyaModule {}
