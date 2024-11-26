import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type MenuEntity = {
  id: string;
  name: string;
  price: number;
  category: string;
};

@Injectable()
export class InMemoryMenuRepository {
  private readonly db: MenuEntity[] = [
    {
      id: randomUUID(),
      name: 'Spicy Miso Tonkotsu Ramen',
      price: 1150,
      category: 'ramen',
    },
    {
      id: randomUUID(),
      name: 'Shoyu Ramen with Grilled Chicken',
      price: 980,
      category: 'ramen',
    },
    {
      id: randomUUID(),
      name: 'Chirashi Sushi',
      price: 2380,
      category: 'sushi',
    },
    {
      id: randomUUID(),
      name: 'Uni and Toro Sushi',
      price: 320,
      category: 'sushi',
    },
  ];

  async find(filters: { category?: string }): Promise<MenuEntity[]> {
    let results = this.db;
    if (filters.category) {
      results = results.filter((item) => item.category === filters.category);
    }

    return results;
  }
}
