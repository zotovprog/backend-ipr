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
    price: number,
    brand?: string,
    memoryAmount?: number,
  ): Promise<Product> {
    const productType =
      await this.productTypeService.getProductTypeById(typeId);
    const newProduct = this.productRepository.create({
      title,
      type: productType,
      price,
      brand,
      memoryAmount,
    });

    newProduct.images = imageUrls.map((url) => {
      const image = new ProductImage();
      image.url = url;
      return image;
    });

    return this.productRepository.save(newProduct);
  }

  // Get all Products, optionally filtered by typeId with pagination
  async getAllProducts(
    typeId?: number,
    itemsPerPage: number = 10,
    page: number = 1,
    brands?: string[],
    memoryAmounts?: number[],
    priceFrom?: number,
    priceTo?: number,
  ): Promise<{ data: ProductListItemDto[]; total: number }> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images');

    if (typeId) {
      query.andWhere('product.typeId = :typeId', { typeId });
    }

    if (brands && brands.length > 0) {
      query.andWhere('product.brand IN (:...brands)', { brands });
    }

    if (memoryAmounts && memoryAmounts.length > 0) {
      query.andWhere('product.memoryAmount IN (:...memoryAmounts)', {
        memoryAmounts,
      });
    }

    if (priceFrom) {
      query.andWhere('product.price >= :priceFrom', { priceFrom });
    }

    if (priceTo) {
      query.andWhere('product.price <= :priceTo', { priceTo });
    }

    // Get the total count before pagination
    const total = await query.getCount();

    // Apply pagination
    const skip = (page - 1) * itemsPerPage;
    query.skip(skip).take(itemsPerPage);

    const products = await query.orderBy('product.id', 'ASC').getMany();

    // Transform products to ProductListItemDto format
    const data = products.map((product) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images.length > 0 ? product.images[0].url : null, // First image or null
      };
    });

    return { data, total };
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
    title?: string,
    typeId?: number,
    imageUrls?: string[],
    price?: number,
    brand?: string,
    memoryAmount?: number,
  ): Promise<Product> {
    const product = await this.getProductById(id);

    // Update fields only if the new values are not undefined or null
    if (title !== undefined && title !== null) {
      product.title = title;
    }

    if (typeId !== undefined && typeId !== null) {
      const productType =
        await this.productTypeService.getProductTypeById(typeId);
      product.type = productType;
    }

    if (price !== undefined && price !== null) {
      product.price = price;
    }

    if (brand !== undefined && brand !== null) {
      product.brand = brand;
    }

    if (memoryAmount !== undefined && memoryAmount !== null) {
      product.memoryAmount = memoryAmount;
    }

    // Update images if imageUrls is provided and not empty
    if (imageUrls && imageUrls.length > 0) {
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
