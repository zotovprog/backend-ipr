import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { File } from 'multer';
import { UploadService } from '../upload/upload.service';
import { ProductTypeDto } from './product-type.dto';
import { ProductType } from './product-type.entity';
import { ProductTypeService } from './product-type.service';

@ApiTags('product-type')
@Controller('product-type')
export class ProductTypeController {
  constructor(
    private readonly productTypeService: ProductTypeService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Создать новый тип продукта с иконкой' })
  @ApiResponse({
    status: 201,
    description: 'Тип продукта был успешно создан.',
  })
  @ApiResponse({ status: 400, description: 'Неверный ввод данных.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Данные для создания нового типа продукта',
    required: true,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Смартфон' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Изображение типа продукта (иконка)',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|bmp|webp)$/)) {
          return callback(
            new BadRequestException('Только изображения разрешены!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async createProductType(
    @Body() productTypeDto: ProductTypeDto,
    @UploadedFile() file: File,
  ): Promise<ProductType> {
    const imageUrl = await this.uploadService.uploadFile(file);
    return this.productTypeService.createProductType(
      productTypeDto.title,
      imageUrl,
    );
  }

  @ApiOperation({ summary: 'Получить все типы продуктов' })
  @ApiResponse({ status: 200, description: 'Возвращает все типы продуктов.' })
  @Get()
  async getAllProductTypes(): Promise<ProductType[]> {
    return this.productTypeService.getAllProductTypes();
  }

  @ApiOperation({ summary: 'Получить тип продукта по ID' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает тип продукта по его ID.',
  })
  @ApiResponse({ status: 404, description: 'Тип продукта не найден.' })
  @Get(':id')
  async getProductTypeById(@Param('id') id: number): Promise<ProductType> {
    return this.productTypeService.getProductTypeById(id);
  }

  @ApiOperation({ summary: 'Обновить тип продукта по ID' })
  @ApiResponse({
    status: 200,
    description: 'Тип продукта был успешно обновлен.',
  })
  @ApiResponse({ status: 404, description: 'Тип продукта не найден.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Данные для обновления типа продукта',
    required: true,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Ноутбук' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Изображение типа продукта (иконка)',
        },
      },
    },
  })
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|bmp|webp)$/)) {
          return callback(
            new BadRequestException('Только изображения разрешены!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updateProductType(
    @Param('id') id: number,
    @Body() productTypeDto: ProductTypeDto,
    @UploadedFile() file: File,
  ): Promise<ProductType> {
    const imageUrl = await this.uploadService.uploadFile(file);
    return this.productTypeService.updateProductType(
      id,
      productTypeDto.title,
      imageUrl,
    );
  }

  @ApiOperation({ summary: 'Удалить тип продукта по ID' })
  @ApiResponse({
    status: 200,
    description: 'Тип продукта был успешно удален.',
  })
  @ApiResponse({ status: 404, description: 'Тип продукта не найден.' })
  @Delete(':id')
  async deleteProductType(@Param('id') id: number): Promise<void> {
    return this.productTypeService.deleteProductType(id);
  }
}
