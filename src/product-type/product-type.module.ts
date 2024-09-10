import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from 'src/product-type/product-type.entity';
import { UploadModule } from 'src/upload/upload.module';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType]), UploadModule],
  controllers: [ProductTypeController],
  exports: [ProductTypeService],
  providers: [ProductTypeService],
})
export class ProductTypeModule {}
