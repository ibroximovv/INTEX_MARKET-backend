import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { GetProductsDto } from './dto/get-products.dto';
import { contains } from 'class-validator';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createProductDto: CreateProductDto) {
    try {
      const category = await this.prisma.category.findFirst({ where: { id: createProductDto.categoryId } })
      if (!category) throw new BadRequestException('Category not found')

      const whereClause: any = {
        price: createProductDto.price,
        discountedPrice: createProductDto.discountedPrice || null,
        categoryId: createProductDto.categoryId,
        frame_en: createProductDto.frame_en,
        depth: createProductDto.depth,
        size: createProductDto.size,
        image: createProductDto.image
      }

      if (createProductDto.frame_uz !== undefined) {
        whereClause.frame_uz = createProductDto.frame_uz;
      }
      if (createProductDto.frame_ru !== undefined) {
        whereClause.frame_ru = createProductDto.frame_ru;
      }

      const findone = await this.prisma.products.findFirst({
        where: whereClause
      });

      if (findone) return await this.prisma.products.update({
        where: { id: findone.id }, data: {
          ...findone,
          quantity: findone.quantity + createProductDto.quantity
        }
      })

      return await this.prisma.products.create({ data: createProductDto });
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

  async findAll(query: GetProductsDto) {
    const { skip = 1, take = 10, search, sortBy, sortOrder = 'asc', categoryId, status } = query;

    const whereClause: any = {
      ...(search && {
        OR: [
          { frame_en: { contains: search, mode: 'insensitive' as const } },
          { frame_uz: { contains: search, mode: 'insensitive' as const } },
          { frame_ru: { contains: search, mode: 'insensitive' as const } },
          { price: { contains: search, mode: 'insensitive' as const } },
        ]
      }),
      ...(categoryId && { categoryId }),
      ...(status && { status })
    };

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.products.findMany({
          where: whereClause,
          include: {
            Category: true
          },
          skip: (Number(skip) - 1) * Number(take),
          take: Number(take),
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined
        }),
        this.prisma.products.count({
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }


  async findOne(id: string) {
    try {
      const findone = await this.prisma.products.findFirst({ where: { id }, include: { Category: true } })
      if (!findone) throw new BadRequestException('Products not found')
      const category = await this.prisma.category.findFirst({ where: { id: findone.categoryId } })
      if (!category) throw new BadRequestException('Category not found')
      return findone
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const findone = await this.prisma.products.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Products not found')
      const category = await this.prisma.category.findFirst({ where: { id: findone.categoryId } })
      if (!category) throw new BadRequestException('Category not found')
      return await this.prisma.products.update({ where: { id }, data: updateProductDto });
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
      const findone = await this.prisma.products.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Products not found')
      return await this.prisma.products.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internale server error')
    }
  }
}
