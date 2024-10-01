import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product.entity';

@Entity()
export class AdditionalInfoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  value: string;

  @ManyToOne(() => Product, (product) => product.additionalInfo)
  product: Product;
}
