import { Injectable } from '@nestjs/common';
import {
  Order,
  OrderId,
  OrderQueryRepository,
  OrderRepository,
  OrderStatus,
} from './domain/order';
import { Item, ItemId } from './domain/item';

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
  }) {
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
  }
}
