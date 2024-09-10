import { ApiProperty } from '@nestjs/swagger';

export class ProductTypeDto {
  @ApiProperty({
    description: 'Название типа продукта',
    example: 'Смартфон',
  })
  title: string;

  @ApiProperty({
    description: 'Иконка для типа продукта',
    example: 'smartphone-icon.png',
  })
  icon: string;
}
