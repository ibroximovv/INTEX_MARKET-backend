import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateConsultatsiyaDto } from './dto/create-consultatsiya.dto';
import { UpdateConsultatsiyaDto } from './dto/update-consultatsiya.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GetConsultatsiyaDto } from './dto/get-consultatsiya.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ConsultatsiyaService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createConsultatsiyaDto: CreateConsultatsiyaDto) {
    try {
      const findone = await this.prisma.consultatsiya.findFirst({
        where: {
          AND: [
            { name: createConsultatsiyaDto.name },
            { phone: createConsultatsiyaDto.phone }
          ]
        }
      })
      if (findone && findone.check == false) throw new BadRequestException('in process')
      return await this.prisma.consultatsiya.create({ data: createConsultatsiyaDto });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }

  async findAll(query: GetConsultatsiyaDto) {
    const { skip = 1, take = 10, check, search, sortBy, sortOrder = 'asc' } = query;

    const whereClause: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ]
      }),
      ...(check !== undefined ? { check } : {})
    };

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.consultatsiya.findMany({
          where: whereClause,
          skip: (Number(skip) - 1) * Number(take),
          take: Number(take),
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined
        }),
        this.prisma.consultatsiya.count({
          where: whereClause
        })
      ]);

      const lastPage = Math.ceil(total / Number(take));

      return {
        data,
        meta: {
          total,
          page: Number(skip),
          lastPage
        }
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.consultatsiya.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Consultatsiya not found!')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }

  async update(id: string, updateConsultatsiyaDto: UpdateConsultatsiyaDto) {
    try {
      const findone = await this.prisma.consultatsiya.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Consultatsiya not found!')
      return await this.prisma.consultatsiya.update({ where: { id }, data: updateConsultatsiyaDto });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.consultatsiya.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Consultatsiya not found!')
      return await this.prisma.consultatsiya.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }
}
