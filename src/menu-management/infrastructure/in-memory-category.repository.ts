export type CategoryEntity = {
  name: string;
};

export class InMemoryCategoryRepository {
  private readonly db: CategoryEntity[] = [
    { name: 'sushi' },
    { name: 'ramen' },
  ];

  async findAll(): Promise<CategoryEntity[]> {
    return this.db;
  }
}
