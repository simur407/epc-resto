import { Module } from '@nestjs/common';
import { InMemoryCategoryRepository } from './infrastructure/in-memory-category.repository';
import { InMemoryMenuRepository } from './infrastructure/in-memory-menu-repository';
import { MenuManagementService } from './menu-management.service';
import { CategoriesController } from './infrastructure/api/categories.controller';
import { MenusController } from './infrastructure/api/menus.controller';

@Module({
  controllers: [CategoriesController, MenusController],
  providers: [
    InMemoryCategoryRepository,
    InMemoryMenuRepository,
    MenuManagementService,
  ],
  exports: [MenuManagementService],
})
export class MenuManagementModule {}
