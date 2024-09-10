import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'poll_user',
      password: 'poll_password',
      database: 'poll_db',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProductModule,
    ProductTypeModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to the 'uploads' directory
      serveRoot: '/uploads', // The route at which files will be available
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
