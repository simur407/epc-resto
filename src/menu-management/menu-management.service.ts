import { Injectable } from '@nestjs/common';
import { InMemoryCategoryRepository } from './infrastructure/in-memory-category.repository';
import { InMemoryMenuRepository } from './infrastructure/in-memory-menu-repository';

@Injectable()
export class MenuManagementService {
  constructor(
    private readonly categories: InMemoryCategoryRepository,
    private readonly menus: InMemoryMenuRepository,
  ) {}

  getCategories() {
    return this.categories.findAll();
  }

  getMenu(query: { category?: string }) {
    return this.menus.find(query);
  }
}
