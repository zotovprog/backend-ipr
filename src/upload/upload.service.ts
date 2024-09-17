import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import { File } from 'multer';
import { join } from 'path';

@Injectable()
export class UploadService {
  private uploadFolder = './uploads';

  constructor() {
    if (!existsSync(this.uploadFolder)) {
      mkdirSync(this.uploadFolder, { recursive: true });
    }
  }

  async uploadFile(file: File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Файл обязателен.');
    }

    // Дополнительная проверка MIME-типа
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|bmp|webp)$/)) {
      throw new BadRequestException('Только изображения разрешены!');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = join(this.uploadFolder, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return `/uploads/${fileName}`;
  }

  async uploadFiles(files: File[]): Promise<string[]> {
    const urls = [];
    for (const file of files) {
      const url = await this.uploadFile(file);
      urls.push(url);
    }
    return urls;
  }
}
