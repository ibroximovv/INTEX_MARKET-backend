import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
      global: true,
      secret: 'intexmas',
      signOptions: { expiresIn: '60s' },
    }),],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
