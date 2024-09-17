import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/product/product-image/product-image.entity';
import { ProductListItemDto } from 'src/product/product-list-item.dto';
import { Repository } from 'typeorm';
import { ProductTypeService } from '../product-type/product-type.service';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    private productTypeService: ProductTypeService,
  ) {}

  // Create a new Product
  async createProduct(
    title: string,
    typeId: number,
    imageUrls: string[],
  ): Promise<Product> {
    const productType =
      await this.productTypeService.getProductTypeById(typeId);
    const newProduct = this.productRepository.create({
      title,
      type: productType,
    });

    newProduct.images = imageUrls.map((url) => {
      const image = new ProductImage();
      image.url = url;
      return image;
    });

    return this.productRepository.save(newProduct);
  }

  // Get all Products
  async getAllProducts(): Promise<ProductListItemDto[]> {
    const products = await this.productRepository.find({
      relations: ['images'],
    });

    // Преобразование продуктов в формат ProductListItemDto
    return products.map((product) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images.length > 0 ? product.images[0].url : null, // Первое изображение или null
      };
    });
  }

  // Get a Product by ID
  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return product;
  }

  // Update a Product by ID
  async updateProduct(
    id: number,
    title: string,
    typeId: number,
    imageUrls: string[],
  ): Promise<Product> {
    const product = await this.getProductById(id);
    const productType =
      await this.productTypeService.getProductTypeById(typeId);

    product.title = title;
    product.type = productType;

    if (imageUrls.length > 0) {
      // Remove existing images
      await this.productImageRepository.delete({ product: { id } });

      product.images = imageUrls.map((url) => {
        const image = new ProductImage();
        image.url = url;
        image.product = product;
        return image;
      });
    }

    return this.productRepository.save(product);
  }

  // Delete a Product by ID
  async deleteProduct(id: number): Promise<void> {
    const product = await this.getProductById(id);
    await this.productRepository.remove(product);
  }
}
