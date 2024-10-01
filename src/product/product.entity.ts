import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ProductType } from '../product-type/product-type.entity';
import { ProductImage } from './product-image/product-image.entity';
import { AdditionalInfoItem } from './entities/additional-info-item.entity';
import { Color } from './entities/color.entity';
import { ShortInfoItem } from './entities/short-info-item.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true, type: 'int' })
  memoryAmount: number;

  @ManyToOne(() => ProductType, (productType) => productType.id, {
    eager: true,
  })
  type: ProductType;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImage[];

  @OneToOne(() => Color, { cascade: true, eager: true })
  @JoinColumn()
  color: Color;

  @Column('text', { array: true, nullable: true })
  selectable_values: string[];

  @OneToMany(() => ShortInfoItem, (shortInfoItem) => shortInfoItem.product, {
    cascade: true,
    eager: true,
  })
  short_info: ShortInfoItem[];

  @OneToMany(
    () => AdditionalInfoItem,
    (additionalInfoItem) => additionalInfoItem.product,
    {
      cascade: true,
      eager: true,
    },
  )
  additionalInfo: AdditionalInfoItem[];
}
