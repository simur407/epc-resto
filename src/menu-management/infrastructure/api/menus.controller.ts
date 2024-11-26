import { Controller, Get, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { MenuManagementService } from '../../menu-management.service';

export class GetMenuQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  category?: string;
}

export class MenuItemResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  price!: number;
}

export class MenuResponseDto {
  @ApiProperty({ type: MenuItemResponseDto, isArray: true })
  items!: MenuItemResponseDto[];
}

@ApiTags('Menu Management', 'Menus')
@Controller('menu-management/menus')
export class MenusController {
  constructor(private readonly menuManagementService: MenuManagementService) {}

  @Get('/')
  async getMenu(@Query() query: GetMenuQueryDto): Promise<MenuResponseDto> {
    const items = await this.menuManagementService.getMenu(query);

    return { items };
  }
}
