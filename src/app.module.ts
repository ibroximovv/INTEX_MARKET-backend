import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { OrdersModule } from './orders/orders.module';
import { SiteModule } from './site/site.module';
import { MulterController } from './multer/multer.controller';
import { ConfigModule } from '@nestjs/config';
import { ConsultatsiyaModule } from './consultatsiya/consultatsiya.module';

@Module({
  imports: [AdminModule, PrismaModule, ProductsModule, CategoryModule, OrdersModule, SiteModule, ConfigModule.forRoot({
    isGlobal: true, // barcha joyda ishlatsin
  }), ConsultatsiyaModule,],
  controllers: [AppController, MulterController],
  providers: [AppService],
})
export class AppModule { }
