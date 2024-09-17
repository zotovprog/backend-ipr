import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { File } from 'multer';
import { ProductListItemDto } from 'src/product/product-list-item.dto';
import { UploadService } from '../upload/upload.service';
import { ProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: 'Создать новый продукт с изображениями' })
  @ApiResponse({
    status: 201,
    description: 'Продукт был успешно создан.',
  })
  @ApiResponse({ status: 400, description: 'Неверный ввод данных.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Данные для создания нового продукта',
    required: true,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Смартфон' },
        typeId: { type: 'number', example: 1 },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Галерея продукта',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
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
  async createProduct(
    @Body() productDto: ProductDto,
    @UploadedFiles() files: File[],
  ): Promise<Product> {
    const { title, typeId } = productDto;
    const imageUrls = await this.uploadService.uploadFiles(files);
    return this.productService.createProduct(title, typeId, imageUrls);
  }

  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiResponse({ status: 200, description: 'Возвращает все продукты.' })
  @ApiQuery({
    name: 'typeId',
    required: false,
    type: Number,
    description: 'ID типа продукта для фильтрации',
  })
  @ApiQuery({
    name: 'itemsPerPage',
    required: false,
    type: Number,
    description: 'Количество продуктов на странице',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
  })
  @Get()
  async getAllProducts(
    @Query('typeId') typeId?: number,
    @Query('itemsPerPage') itemsPerPage?: number,
    @Query('page') page?: number,
  ): Promise<{ data: ProductListItemDto[]; total: number }> {
    return this.productService.getAllProducts(typeId, itemsPerPage, page);
  }

  @ApiOperation({ summary: 'Получить продукт по ID' })
  @ApiResponse({ status: 200, description: 'Возвращает продукт по его ID.' })
  @ApiResponse({ status: 404, description: 'Продукт не найден.' })
  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @ApiOperation({ summary: 'Обновить продукт по ID' })
  @ApiResponse({
    status: 200,
    description: 'Продукт был успешно обновлен.',
  })
  @ApiResponse({ status: 404, description: 'Продукт не найден.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Данные для обновления продукта',
    required: true,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Смартфон' },
        typeId: { type: 'number', example: 1 },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Галерея продукта',
        },
      },
    },
  })
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
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
  async updateProduct(
    @Param('id') id: number,
    @Body() productDto: ProductDto,
    @UploadedFiles() files: File[],
  ): Promise<Product> {
    const { title, typeId } = productDto;
    const imageUrls = await this.uploadService.uploadFiles(files);
    return this.productService.updateProduct(+id, title, +typeId, imageUrls);
  }

  @ApiOperation({ summary: 'Удалить продукт по ID' })
  @ApiResponse({
    status: 200,
    description: 'Продукт был успешно удален.',
  })
  @ApiResponse({ status: 404, description: 'Продукт не найден.' })
  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
