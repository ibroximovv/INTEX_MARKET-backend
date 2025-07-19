import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetSiteDto } from './dto/get-site.dto';

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createSiteDto: CreateSiteDto) {
    try {
      const findone = await this.prisma.site.findFirst()
      if (findone) throw new BadRequestException('Site info already exists')
      return await this.prisma.site.create({ data: createSiteDto });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetSiteDto) {
    const { skip = 1, take = 10, sortBy, sortOrder = 'asc' } = query;

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.site.findMany({
          skip: (Number(skip) - 1) * Number(take),
          take: Number(take),
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined
        }),
        this.prisma.site.count()
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
      const findone = await this.prisma.site.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('site not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateSiteDto: UpdateSiteDto) {
    try {
      const findone = await this.prisma.site.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('site not found')
      return await this.prisma.site.update({ where: { id }, data: updateSiteDto });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.site.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('site not found')
      return await this.prisma.site.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
