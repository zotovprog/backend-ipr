import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import { File } from 'multer';
import { join } from 'path';

@Injectable()
export class UploadService {
  private uploadFolder = './uploads'; // Define the folder for uploads

  constructor() {
    // Ensure the upload folder exists
    if (!existsSync(this.uploadFolder)) {
      mkdirSync(this.uploadFolder, { recursive: true });
    }
  }

  async uploadFile(file: File): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    // Generate file path (you can also add unique identifiers like timestamp)
    const filePath = join(this.uploadFolder, file.originalname);

    // Save the file to the upload folder (file.buffer contains the uploaded file's data)
    fs.writeFileSync(filePath, file.buffer);

    // Return the relative path to the file (for example, for a URL in an API response)
    return `/uploads/${file.originalname}`;
  }
}
