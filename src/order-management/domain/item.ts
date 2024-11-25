import { isUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { ValidationError } from '@ddd/validation.error';

export class ItemId {
  constructor(private readonly value: string) {}

  static new(): ItemId {
    return new ItemId(randomUUID());
  }

  static from(value: unknown): ItemId {
    if (!isUUID(value)) {
      throw new ValidationError(`Given value is not an uuid: ${value}`);
    }
    // `isUUID` validates if unknown is a string, so this is safe
    return new ItemId(value as string);
  }

  toString(): string {
    return this.value;
  }
}

export type ItemState = {
  id: ItemId;
  name: string;
  quantity: number;
  price: number; // in lowest unit, eg. cents in Dolar
};

export class Item {
  public readonly id: ItemId;
  public readonly name: string;
  public readonly quantity: number;
  public readonly price: number;

  constructor(state: ItemState) {
    this.id = state.id;
    this.name = state.name;
    this.quantity = state.quantity;
    this.price = state.price;
  }

  static create({
    id,
    quantity,
    name,
    price,
  }: {
    id: ItemId;
    quantity: number;
    name: string;
    price: number;
  }) {
    if (quantity <= 0) {
      throw new ValidationError("Item's quantity must be positive");
    }

    return new Item({ id, name, quantity, price });
  }

  toObject(): ItemState {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      price: this.price,
    };
  }
}
