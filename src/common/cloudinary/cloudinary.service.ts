import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; public_id: string }> {
    try {
      const result = await cloudinary.uploader.upload(file.path);
      return result;
    } catch (error) {
      throw new NotFoundException('File upload failed', error.message);
    }
  }

  async deleteFile(public_id: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(public_id);
      return result;
    } catch (error) {
      throw new NotFoundException('File deleted failed');
    }
  }

  async updateFile(
    file: Express.Multer.File,
    publicId: string,
  ): Promise<{ url: string; public_id: string }> {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        public_id: publicId,
        overwrite: true,
      });
      return result;
    } catch (error) {
      throw new NotFoundException('File updated failed');
    }
  }

  async uploadFileBase64(
    file: Express.Multer.File,
  ): Promise<{ url: string; public_id: string }> {
    try {
      const path = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(path);
      return result;
    } catch (error) {
      throw new NotFoundException('File upload failed', error.message);
    }
  }

  async updateFileBase64(
    file: Express.Multer.File,
    publicId: string,
  ): Promise<any> {
    try {
      const path = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(path, {
        public_id: publicId,
        overwrite: true,
      });
      return result;
    } catch (error) {
      throw new NotFoundException('File updated failed');
    }
  }
}
