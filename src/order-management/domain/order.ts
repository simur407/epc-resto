import { isUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { ValidationError } from '@ddd/validation.error';
import { BusinessRuleViolation } from '@ddd/business-rule-violation.error';
import { Item, ItemState } from './item';
import { OrderDto } from '../order-management.service';

export class OrderId {
  constructor(private readonly value: string) {}

  static new(): OrderId {
    return new OrderId(randomUUID());
  }

  static from(value: unknown): OrderId {
    if (!isUUID(value)) {
      throw new ValidationError(`Given value is not an uuid: ${value}`);
    }
    // `isUUID` validates if unknown is a string, so this is safe
    return new OrderId(value as string);
  }

  equals(other: OrderId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class OrderPlaced {
  private _ = 'order-placed';
  constructor(public readonly id: string, public readonly items: ItemState[]) {}
}

export class OrderInPreparation {
  private _ = 'order-in-preparation';
  // an improvement: we could add Cook as part of this event
  constructor(public readonly id: string) {}
}

export class OrderPrepared {
  private _ = 'order-prepared';
  // an improvement: we could add Cook as part of this event
  constructor(public readonly id: string) {}
}

export class OrderPickedUp {
  private _ = 'order-picked-up';
  // an improvement: we could add Waiter as part of this event
  constructor(public readonly id: string) {}
}

export class OrderDelivered {
  private _ = 'order-delivered';
  // an improvement: we could add Waiter as part of this event
  constructor(public readonly id: string) {}
}

export type OrderEvents =
  | OrderPlaced
  | OrderInPreparation
  | OrderPrepared
  | OrderPickedUp
  | OrderDelivered;

export type OrderStatus =
  | 'placed'
  | 'in-the-kitchen'
  | 'prepared'
  | 'in-delivery'
  | 'delivered';

export type OrderState = {
  id: OrderId;
  status: OrderStatus;
  items: ItemState[];
};

export class Order {
  private events: OrderEvents[] = [];
  public readonly id: OrderId;
  private status: OrderStatus;

  constructor(state: OrderState) {
    this.id = state.id;
    this.status = state.status;
  }

  static place({ id, items }: { id: OrderId; items: Item[] }) {
    if (items.length === 0) {
      throw new BusinessRuleViolation('Order has to have at least one item');
    }

    const itemStates = items.map((i) => i.toObject());
    const order = new Order({
      id,
      status: 'placed',
      items: itemStates,
    });
    order.events.push(new OrderPlaced(id.toString(), itemStates));
    return order;
  }

  startPreparing() {
    if (this.status !== 'placed') {
      throw new BusinessRuleViolation(
        'No longer possible to start preparing food',
      );
    }

    this.events.push(new OrderInPreparation(this.id.toString()));
    this.status = 'in-the-kitchen';
  }

  finishPreparation() {
    if (this.status !== 'in-the-kitchen') {
      throw new BusinessRuleViolation('Order is not in the kitchen');
    }

    this.events.push(new OrderPrepared(this.id.toString()));
    this.status = 'prepared';
  }

  pickUp() {
    if (this.status !== 'prepared') {
      throw new BusinessRuleViolation('Cannot pick up that order');
    }

    this.events.push(new OrderPickedUp(this.id.toString()));
    this.status = 'in-delivery';
  }

  deliver() {
    if (this.status !== 'in-delivery') {
      throw new BusinessRuleViolation('Order is not in deliery');
    }

    this.events.push(new OrderDelivered(this.id.toString()));
  }

  getEvents(): OrderEvents[] {
    const events = [...this.events];
    // flush events
    this.events = [];
    return events;
  }
}

export abstract class OrderRepository {
  abstract load(id: OrderId): Promise<Order | null>;
  abstract save(order: Order): Promise<void>;
}

export abstract class OrderQueryRepository {
  abstract getOrder(id: string): Promise<OrderDto | null>;
  abstract findOrders(filters: { status?: OrderStatus }): Promise<OrderDto[]>;
}
