import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductType } from './product-type.entity';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepository: Repository<ProductType>,
  ) {}

  // Create a new ProductType with image URL
  async createProductType(
    title: string,
    imageUrl: string,
  ): Promise<ProductType> {
    const newProductType = this.productTypeRepository.create({
      title,
      icon: imageUrl,
    });
    return this.productTypeRepository.save(newProductType);
  }

  // Get all ProductTypes
  async getAllProductTypes(): Promise<ProductType[]> {
    return this.productTypeRepository.find();
  }

  // Get a ProductType by ID
  async getProductTypeById(id: number): Promise<ProductType> {
    const productType = await this.productTypeRepository.findOneBy({ id });
    if (!productType) {
      throw new NotFoundException(`Product Type with ID ${id} not found.`);
    }
    return productType;
  }

  // Update a ProductType by ID
  async updateProductType(
    id: number,
    title: string,
    imageUrl: string,
  ): Promise<ProductType> {
    const productType = await this.getProductTypeById(id);
    productType.title = title;
    productType.icon = imageUrl;
    return this.productTypeRepository.save(productType);
  }

  // Delete a ProductType by ID
  async deleteProductType(id: number): Promise<void> {
    const productType = await this.getProductTypeById(id);
    await this.productTypeRepository.remove(productType);
  }
}
