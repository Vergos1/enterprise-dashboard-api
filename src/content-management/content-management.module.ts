import { Module } from '@nestjs/common';
import { ContentManagementService } from './content-management.service';
import { ContentManagementController } from './content-management.controller';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [CategoriesModule],
  providers: [ContentManagementService],
  controllers: [ContentManagementController],
})
export class ContentManagementModule {}
