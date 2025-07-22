import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ConsultatsiyaService } from './consultatsiya.service';
import { CreateConsultatsiyaDto } from './dto/create-consultatsiya.dto';
import { UpdateConsultatsiyaDto } from './dto/update-consultatsiya.dto';
import { GetConsultatsiyaDto } from './dto/get-consultatsiya.dto';

@Controller('consultatsiya')
export class ConsultatsiyaController {
  constructor(private readonly consultatsiyaService: ConsultatsiyaService) {}

  @Post()
  create(@Body() createConsultatsiyaDto: CreateConsultatsiyaDto) {
    return this.consultatsiyaService.create(createConsultatsiyaDto);
  }

  @Get()
  findAll(@Query() query: GetConsultatsiyaDto) {
    return this.consultatsiyaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultatsiyaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultatsiyaDto: UpdateConsultatsiyaDto) {
    return this.consultatsiyaService.update(id, updateConsultatsiyaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultatsiyaService.remove(id);
  }
}
