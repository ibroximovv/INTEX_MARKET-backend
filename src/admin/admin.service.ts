import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createAdminDto: CreateAdminDto) {
    try {
      const findone = await this.prisma.admin.findFirst({ where: { username: createAdminDto.username } })
      if (findone) throw new BadRequestException(`Admin already exists`)
      const hashedPassword = bcrypt.hashSync(createAdminDto.password, 10)
      return await this.prisma.admin.create({
        data: {
          ...createAdminDto,
          password: hashedPassword
        }
      })
    } catch (error) {
      if (error instanceof BadRequestException) {
      throw error;
    }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async login(loginAdminDto: CreateAdminDto) {
    try {
      const findone = await this.prisma.admin.findFirst({ where: { username: loginAdminDto.username } })
      if (!findone) throw new BadRequestException('Admin not found')
      const matchPassword = bcrypt.compareSync(loginAdminDto.password, findone.password)
      return matchPassword
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.admin.findMany({ omit: { password: true }})
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.admin.findFirst({ where: { id }, omit: { password: true } })
      if (!findone) throw new BadRequestException('Admin not found')
      return findone
    } catch (error) {
      if (error instanceof BadRequestException) {
      throw error;
    }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const findone = await this.prisma.admin.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Admin not found')
      let hashedPassword = findone.password
      if (updateAdminDto.password) {
        hashedPassword = bcrypt.hashSync(updateAdminDto.password, 10)
      }
      return await this.prisma.admin.update({ where: { id }, data: { ...updateAdminDto, password: hashedPassword } });
    } catch (error) {
      if (error instanceof BadRequestException) {
      throw error;
    }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.admin.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Admin not found')
      return await this.prisma.admin.delete({ where: { id } })
    } catch (error) {
      if (error instanceof BadRequestException) {
      throw error;
    }
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
