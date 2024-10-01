import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product.entity';

@Entity()
export class ShortInfoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  icon: string;

  @Column()
  value: string;

  @ManyToOne(() => Product, (product) => product.short_info)
  product: Product;
}
