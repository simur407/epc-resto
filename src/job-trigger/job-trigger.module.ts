import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Module, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Queue } from 'bullmq';
import { IsString } from 'class-validator';

class JobTriggerBodyDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty({
    enum: ['start-preparation', 'finish-preparation', 'pick-up', 'deliver'],
  })
  @IsString()
  name!: string;
}

@ApiTags('Job trigger')
@Controller('job-trigger/jobs')
export class JobTriggerController {
  constructor(@InjectQueue('orders') private readonly jobQueue: Queue) {}

  @Post()
  async triggerJob(@Body() body: JobTriggerBodyDto) {
    await this.jobQueue.add(body.name, { id: body.id });
  }
}

@Module({
  imports: [BullModule.registerQueue({ name: 'orders' })],
  controllers: [JobTriggerController],
})
export class JobTriggerModule {}
