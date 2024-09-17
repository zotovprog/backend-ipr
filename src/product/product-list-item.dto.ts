import { ApiProperty } from '@nestjs/swagger';

export class ProductListItemDto {
  @ApiProperty({
    description: 'ID продукта',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Название продукта',
    example: 'Смартфон',
  })
  title: string;

  @ApiProperty({
    description: 'Первое изображение продукта',
    example: '/uploads/smartphone-image1.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Цена продукта',
    example: 19990,
  })
  price: number;
}
