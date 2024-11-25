import {
  OrderQueryRepository,
  OrderState,
  OrderStatus,
} from '@order-management/domain/order';
import { OrderDto } from '@order-management/order-management.service';

export class InMemoryOrderQueryRepository extends OrderQueryRepository {
  constructor(private items: OrderState[]) {
    super();
  }

  async getOrder(id: string): Promise<OrderDto | null> {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return this.map([order])[0];
  }

  async findOrders(filters: { status?: OrderStatus }): Promise<OrderDto[]> {
    let orders = this.items;

    if (filters.status !== undefined) {
      orders = orders.filter((order) => order.status === filters.status);
    }

    return this.map(orders);
  }

  private map(states: OrderState[]): OrderDto[] {
    return states.map((s) => {
      return {
        id: s.id.toString(),
        status: s.status,
        totalPrice: s.items.reduce((sum, item) => {
          return sum + item.price * item.quantity;
        }, 0),
        items: s.items.map((i) => ({
          id: i.id.toString(),
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      };
    });
  }
}
