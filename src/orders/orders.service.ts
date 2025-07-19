import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetOrdersDto } from './dto/get-orders.dto';
import { contains } from 'class-validator';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createOrderDto: CreateOrderDto) {
    try {
      const product = await this.prisma.products.findFirst({ where: { id: createOrderDto.productsId } })
      if (!product) throw new BadRequestException('Product not found')
      const created = await this.prisma.orders.create({ data: createOrderDto })
      await this.prisma.products.update({
        where: { id: product.id }, data: {
          ...product,
          quantity: product.quantity - 1
        }
      })

      return created;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Field "${error.meta?.target}" must be unique`);
        }
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetOrdersDto) {
    const { skip = 1, take = 10, check, productsId, search, sortBy, sortOrder = 'asc' } = query;

    const whereClause: Prisma.OrdersWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { adress: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ]
      }),
      ...(productsId && { productsId }),
      ...(check !== undefined ? { check } : {})
    };

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.orders.findMany({
          where: whereClause,
          include: {
            Products: true
          },
          skip: (Number(skip) - 1) * Number(take),
          take: Number(take),
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined
        }),
        this.prisma.orders.count({
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
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }


  async findOne(id: string) {
    try {
      const findone = await this.prisma.orders.findFirst({ where: { id }, include: { Products: true } })
      if (!findone) throw new BadRequestException('Order not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const findone = await this.prisma.orders.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Order not found')
      return await this.prisma.orders.update({ where: { id }, data: updateOrderDto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Field "${error.meta?.target}" must be unique`);
        }
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.orders.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Order not found')
      return await this.prisma.orders.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
