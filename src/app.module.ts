import { ConfigModule, ConfigService } from 'nestjs-config';
import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrdersModule } from '@order-management/orders.module';
import { MealsModule } from '@menu-management/meals.module';
import { CategoriesModule } from '@categories/categories.module';
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
    OrdersModule,
    MealsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
