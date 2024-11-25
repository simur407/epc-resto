import { DynamicModule, Module } from '@nestjs/common';
import {
  OrderQueryRepository,
  OrderRepository,
  OrderState,
} from './domain/order';
import { InMemoryOrderQueryRepository } from './infrastructure/in-memory-order.query-repository';
import { InMemoryOrderRepository } from './infrastructure/in-memory-order.repository';
import { OrderManagementService } from './order-management.service';
import { OrdersController } from './orders.controller';

@Module({})
export class OrderManagementModule {
  static forRoot(config: { db: OrderState[] }): DynamicModule {
    return {
      module: OrderManagementModule,
      controllers: [OrdersController],
      providers: [
        {
          provide: OrderRepository,
          useFactory: () => new InMemoryOrderRepository(config.db),
        },
        {
          provide: OrderQueryRepository,
          useFactory: () => new InMemoryOrderQueryRepository(config.db),
        },
        OrderManagementService,
      ],
      exports: [OrderManagementService],
    };
  }
}
