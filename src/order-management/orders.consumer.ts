import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OrderManagementService } from './order-management.service';

@Processor('orders')
export class OrdersConsumer extends WorkerHost {
  constructor(private readonly orderManagementService: OrderManagementService) {
    super();
  }

  async process(job: Job): Promise<any> {
    try {
      switch (job.name) {
        case 'start-preparation': {
          await this.orderManagementService.startPreparingOrder(job.data);
          break;
        }
        case 'finish-preparation': {
          await this.orderManagementService.finishPreparingOrder(job.data);
          break;
        }
        case 'pick-up': {
          await this.orderManagementService.pickUpOrder(job.data);
          break;
        }
        case 'deliver': {
          await this.orderManagementService.deliverOrder(job.data);
          break;
        }
      }
    } catch (e) {
      console.error(`Job "${job.name}" failed with error:`, e?.message ?? e);
    }
  }
}
