import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductType } from '../product-type/product-type.entity'; // Adjust the path as necessary

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => ProductType, (productType) => productType.id, {
    eager: true,
  })
  type: ProductType;
}
