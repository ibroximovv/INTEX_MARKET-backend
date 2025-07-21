import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCategoryDto } from './dto/get-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const findone = await this.prisma.category.findFirst({ where: { name: createCategoryDto.name } })
      if (findone) throw new BadRequestException('Category already exists')
      return await this.prisma.category.create({ data: createCategoryDto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Field "${error.meta?.target}" must be unique`);
        }
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }

  async findAll(query: GetCategoryDto) {
    const { skip = 1, take = 10, search, sortBy, sortOrder = 'asc' } = query
    const whereClause: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { name_en: { contains: search, mode: 'insensitive' as const } },
          { name_ru: { contains: search, mode: 'insensitive' as const } },
          { name_uz: { contains: search, mode: 'insensitive' as const } },
        ]
      })
    }
    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.category.findMany({
          where: whereClause,
          skip: (Number(skip) - 1) * Number(take),
          take: Number(take),
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined
        }),
        this.prisma.category.count({
          where: whereClause
        })
      ])
      const lastPage = Math.ceil(total / Number(take))
      return { data, meta: { total, page: Number(skip), lastPage } };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.category.findFirst({
        where: { id }
      })
      if (!findone) throw new BadRequestException('Category not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const findone = await this.prisma.category.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Category not found')
      return await this.prisma.category.update({ where: { id }, data: updateCategoryDto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Field "${error.meta?.target}" must be unique`);
        }
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.category.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Category not found')
      return await this.prisma.category.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }
}
