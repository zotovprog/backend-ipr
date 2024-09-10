import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';

@Module({
  providers: [UploadService], // Register the UploadService
  controllers: [], // Optional: only if you want a dedicated upload controller
  exports: [UploadService], // Export UploadService so other modules can use it
})
export class UploadModule {}
