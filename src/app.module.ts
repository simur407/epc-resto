import { ConfigModule, ConfigService } from 'nestjs-config';
import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrderManagementModule } from '@order-management/order-management.module';
import { MenuManagementModule } from '@menu-management/menu-management.module';
import { ConfigNames } from '@config/config-names.enum';

@Module({
  imports: [
    ConfigModule.load(
      resolve(__dirname, 'config', '**/!(*.d).config.{ts,js}'),
      {
        modifyConfigName: (name) => name.replace('.config', ''),
      },
    ),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: configService.get(ConfigNames.redis),
      }),
      inject: [ConfigService],
    }),
    OrderManagementModule.forRoot({ db: [] }),
    MenuManagementModule,
  ],
})
export class AppModule {}
