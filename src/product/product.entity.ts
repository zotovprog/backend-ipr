import { ProductImage } from 'src/product/product-image/product-image.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductType } from '../product-type/product-type.entity'; // Adjust the path as necessary

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @ManyToOne(() => ProductType, (productType) => productType.id, {
    eager: true,
  })
  type: ProductType;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImage[];
}
