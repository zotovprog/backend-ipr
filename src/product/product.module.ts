import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeModule } from 'src/product-type/product-type.module';
import { ProductImage } from 'src/product/product-image/product-image.entity';
import { UploadModule } from 'src/upload/upload.module';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { Color } from './entities/color.entity';
import { AdditionalInfoItem } from './entities/additional-info-item.entity';
import { ShortInfoItem } from './entities/short-info-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      Color,
      AdditionalInfoItem,
      ShortInfoItem,
    ]),
    ProductTypeModule,
    UploadModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
