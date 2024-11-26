import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import {
  OrderQueryRepository,
  OrderRepository,
  OrderState,
} from './domain/order';
import { InMemoryOrderQueryRepository } from './infrastructure/in-memory-order.query-repository';
import { InMemoryOrderRepository } from './infrastructure/in-memory-order.repository';
import { OrdersProcessor } from './orders.processor';
import { MenuManagementModule } from '@menu-management/menu-management.module';
import { OrderManagementService } from './order-management.service';
import { OrdersController } from './infrastructure/api/orders.controller';

@Module({})
export class OrderManagementModule {
  static forRoot(config: { db: OrderState[] }): DynamicModule {
    return {
      module: OrderManagementModule,
      imports: [
        MenuManagementModule,
        BullModule.registerQueue({ name: 'orders' }),
      ],
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
        OrdersProcessor,
        OrderManagementService,
      ],
      exports: [OrderManagementService],
    };
  }
}
