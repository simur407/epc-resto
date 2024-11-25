import { Controller, Get, Post } from '@nestjs/common';
import { OrderManagementService } from './order-management.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrderManagementService) {}

  @Post('/')
  createOrder() {
    // create a new order
  }

  @Get('/')
  getOrders() {
    // return all orders with status
  }

  @Get('/:orderId')
  getOrder() {
    // return order details
  }
}
