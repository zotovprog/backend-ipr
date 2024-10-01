import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ColorDto {
  @ApiProperty({ description: 'Название цвета', example: 'Red' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Цвет в формате HEX', example: '#FF0000' })
  @IsString()
  color: string;
}

export class ShortInfoItemDto {
  @ApiProperty({ description: 'Название информации', example: 'Battery' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Иконка информации',
    example: 'battery-icon.png',
  })
  @IsString()
  icon: string;

  @ApiProperty({ description: 'Значение', example: '5000mAh' })
  @IsString()
  value: string;
}

export class AdditionalInfoItemDto {
  @ApiProperty({
    description: 'Название дополнительной информации',
    example: 'Warranty',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Значение дополнительной информации',
    example: '2 years',
  })
  @IsString()
  value: string;
}

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

  @ApiProperty({
    description: 'Бренд продукта',
    example: 'Samsung',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({
    description: 'Объем памяти продукта',
    example: 64,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  memoryAmount?: number;

  @ApiProperty({
    description: 'Цвет продукта',
    required: false,
    type: ColorDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ColorDto)
  color?: ColorDto;

  @ApiProperty({
    description: 'Список возможных значений для выбора',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectable_values?: string[];

  @ApiProperty({
    description: 'Краткая информация о продукте',
    required: false,
    type: [ShortInfoItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShortInfoItemDto)
  short_info?: ShortInfoItemDto[];

  @ApiProperty({
    description: 'Дополнительная информация о продукте',
    required: false,
    type: [AdditionalInfoItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalInfoItemDto)
  additionalInfo?: AdditionalInfoItemDto[];
}
