import {
  Order,
  OrderDelivered,
  OrderId,
  OrderInPreparation,
  OrderPickedUp,
  OrderPlaced,
  OrderPrepared,
  OrderRepository,
  OrderState,
} from '../domain/order';
import { OrderNotFoundError } from '../order-not-found.error';

export class InMemoryOrderRepository extends OrderRepository {
  constructor(private items: OrderState[]) {
    super();
  }

  async load(id: OrderId): Promise<Order | null> {
    const order = this.items.find((item) => item.id.equals(id));

    if (!order) {
      return null;
    }

    return new Order(order);
  }

  async save(order: Order): Promise<void> {
    const foundOrder = this.items.find((item) => item.id.equals(order.id));

    for (const event of order.getEvents()) {
      if (event instanceof OrderPlaced) {
        if (foundOrder) {
          throw new Error(`Order with id ${order.id} already exists`);
        }
        this.items.push({
          id: OrderId.from(event.id),
          status: 'placed',
          items: event.items,
        });
      }
      if (event instanceof OrderInPreparation) {
        if (!foundOrder) {
          throw new OrderNotFoundError();
        }

        foundOrder.status = 'in-the-kitchen';
      }
      if (event instanceof OrderPrepared) {
        if (!foundOrder) {
          throw new OrderNotFoundError();
        }

        foundOrder.status = 'in-the-kitchen';
      }
      if (event instanceof OrderPickedUp) {
        if (!foundOrder) {
          throw new OrderNotFoundError();
        }

        foundOrder.status = 'in-delivery';
      }
      if (event instanceof OrderDelivered) {
        if (!foundOrder) {
          throw new OrderNotFoundError();
        }

        foundOrder.status = 'delivered';
      }
    }
  }
}
