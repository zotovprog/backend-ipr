import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    description: 'Название продукта',
    example: 'Смартфон',
  })
  title: string;

  @ApiProperty({
    description: 'ID типа продукта',
    example: 1, // This will refer to a specific ProductType
  })
  typeId: number;
}
