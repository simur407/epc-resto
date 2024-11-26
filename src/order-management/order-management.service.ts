import { Injectable } from '@nestjs/common';
import {
  Order,
  OrderId,
  OrderQueryRepository,
  OrderRepository,
  OrderStatus,
} from './domain/order';
import { Item, ItemId } from './domain/item';
import { OrderNotFoundError } from './order-not-found.error';
import { ValidationError } from '@ddd/validation.error';
import { MenuManagementService } from '@menu-management/menu-management.service';

type ItemDto = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderDto = {
  id: string;
  status: string;
  totalPrice: number;
  items: ItemDto[];
};

@Injectable()
export class OrderManagementService {
  constructor(
    private readonly menuManagementRepository: MenuManagementService,
    private readonly orderRepository: OrderRepository,
    private readonly orderQueryReposiory: OrderQueryRepository,
  ) {}

  async findOrders(query: { status?: OrderStatus }): Promise<OrderDto[]> {
    return this.orderQueryReposiory.findOrders(query);
  }

  async getOrder(query: { id: string }): Promise<OrderDto | null> {
    return this.orderQueryReposiory.getOrder(query.id);
  }

  async placeOrder(command: {
    items: { id: string; name: string; price: number; quantity: number }[];
  }): Promise<string> {
    const menu = await this.menuManagementRepository.getMenu({});

    // verify if items are the same as in menu
    for (const item of command.items) {
      const menuItem = menu.find((m) => m.id === item.id);
      if (!menuItem) {
        throw new ValidationError(`No menu item with id: ${item.id}`);
      }

      if (menuItem.name !== item.name || menuItem.price !== item.price) {
        throw new ValidationError(
          `Item with id ${item.id} does not match menu item`,
        );
      }
    }

    const id = OrderId.new();
    const order = Order.place({
      id,
      items: command.items.map((i) =>
        Item.create({
          id: ItemId.from(i.id),
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        }),
      ),
    });
    await this.orderRepository.save(order);
    return id.toString();
  }

  async startPreparingOrder(command: { id: string }) {
    const order = await this.orderRepository.load(OrderId.from(command.id));

    if (!order) {
      throw new OrderNotFoundError();
    }

    order.startPreparing();
    await this.orderRepository.save(order);
  }

  async finishPreparingOrder(command: { id: string }) {
    const order = await this.orderRepository.load(OrderId.from(command.id));

    if (!order) {
      throw new OrderNotFoundError();
    }

    order.finishPreparation();
    await this.orderRepository.save(order);
  }

  async pickUpOrder(command: { id: string }) {
    const order = await this.orderRepository.load(OrderId.from(command.id));

    if (!order) {
      throw new OrderNotFoundError();
    }

    order.pickUp();
    await this.orderRepository.save(order);
  }

  async deliverOrder(command: { id: string }) {
    const order = await this.orderRepository.load(OrderId.from(command.id));

    if (!order) {
      throw new OrderNotFoundError();
    }

    order.deliver();
    await this.orderRepository.save(order);
  }
}
