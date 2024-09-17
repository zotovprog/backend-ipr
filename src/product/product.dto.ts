import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @ApiProperty({ description: 'Название продукта', example: 'Смартфон' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'ID типа продукта', example: 1 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  typeId: number;

  @ApiProperty({ description: 'Цена за продукт', example: 19990 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;
}
