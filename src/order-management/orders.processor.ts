import { Processor } from '@nestjs/bullmq';

@Processor('orders')
export class OrdersProcessor {}
