import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductDto } from './product.dto'; // Update this DTO to include typeId
import { Product } from './product.entity';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Создать новый продукт' })
  @ApiResponse({
    status: 201,
    description: 'Продукт был успешно создан.',
  })
  @ApiResponse({ status: 400, description: 'Неверный ввод данных.' })
  @Post()
  async createProduct(@Body() productDto: ProductDto): Promise<Product> {
    const { title, typeId } = productDto;
    return this.productService.createProduct(title, typeId);
  }

  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiResponse({ status: 200, description: 'Возвращает все продукты.' })
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
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
  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() productDto: ProductDto,
  ): Promise<Product> {
    const { title, typeId } = productDto;
    return this.productService.updateProduct(id, title, typeId);
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
