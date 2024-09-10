import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTypeService } from '../product-type/product-type.service'; // Adjust the path
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private productTypeService: ProductTypeService, // Inject the ProductType service
  ) {}

  // Create a new Product
  async createProduct(title: string, typeId: number): Promise<Product> {
    const productType =
      await this.productTypeService.getProductTypeById(typeId); // Ensure the type exists
    const newProduct = this.productRepository.create({
      title,
      type: productType,
    });
    return this.productRepository.save(newProduct);
  }

  // Get all Products
  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
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
  ): Promise<Product> {
    const product = await this.getProductById(id);
    const productType =
      await this.productTypeService.getProductTypeById(typeId); // Ensure the type exists

    product.title = title;
    product.type = productType;

    return this.productRepository.save(product);
  }

  // Delete a Product by ID
  async deleteProduct(id: number): Promise<void> {
    const product = await this.getProductById(id);
    await this.productRepository.remove(product);
  }
}
