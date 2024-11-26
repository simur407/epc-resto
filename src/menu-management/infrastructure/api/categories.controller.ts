import { Controller, Get } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { MenuManagementService } from '../../menu-management.service';

export class CategoryResponseDto {
  @ApiProperty()
  name!: string;
}

export class CategoriesResponseDto {
  @ApiProperty({ type: CategoryResponseDto, isArray: true })
  items!: CategoryResponseDto[];
}

@ApiTags('Menu Management', 'Categories')
@Controller('menu-management/categories')
export class CategoriesController {
  constructor(private readonly menuManagementService: MenuManagementService) {}

  @Get('/')
  async getCategories(): Promise<CategoriesResponseDto> {
    const items = await this.menuManagementService.getCategories();
    return { items };
  }
}
