import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/order';
import { OrderManagementService } from '../../order-management.service';

export class PlaceOrderItemBodyDto {
  @ApiProperty()
  @IsUUID()
  id!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  price!: number;

  @ApiProperty()
  @IsPositive()
  @Type(() => Number)
  quantity!: number;
}

export class PlaceOrderBodyDto {
  @ApiProperty({ type: PlaceOrderItemBodyDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItemBodyDto)
  items!: PlaceOrderItemBodyDto[];
}

export class PlaceOrderResponseDto {
  @ApiProperty()
  id!: string;
}

export class GetOrderParamDto {
  @ApiProperty()
  @IsUUID()
  id!: string;
}

export class GetOrdersQueryDto {
  @ApiPropertyOptional({
    enum: ['placed', 'in-the-kitchen', 'prepared', 'in-delivery', 'delivered'],
  })
  @IsOptional()
  @IsIn(['placed', 'in-the-kitchen', 'prepared', 'in-delivery', 'delivered'])
  public status?: OrderStatus;
}

export class ItemResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  quantity!: number;
}

export class GetOrderResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({
    enum: ['placed', 'in-the-kitchen', 'prepared', 'in-delivery', 'delivered'],
  })
  status!: string;

  @ApiProperty()
  totalPrice!: number;

  @ApiProperty({ type: ItemResponseDto, isArray: true })
  items!: ItemResponseDto[];
}

export class GetOrdersResponseDto {
  @ApiProperty({ type: GetOrderResponseDto, isArray: true })
  items!: GetOrderResponseDto[];
}

@ApiTags('Order Management')
@Controller('order-management/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrderManagementService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async placeOrder(
    @Body() order: PlaceOrderBodyDto,
  ): Promise<PlaceOrderResponseDto> {
    const id = await this.ordersService.placeOrder(order);
    return {
      id,
    };
  }

  @Get('/')
  async getOrders(
    @Query() query: GetOrdersQueryDto,
  ): Promise<GetOrdersResponseDto> {
    const orders = await this.ordersService.findOrders(query);

    return {
      items: orders,
    };
  }

  @Get('/:orderId')
  async getOrder(
    @Param('orderId') orderId: string,
  ): Promise<GetOrderResponseDto> {
    const order = await this.ordersService.getOrder({ id: orderId });

    if (!order) {
      throw new NotFoundException();
    }

    return order;
  }
}
