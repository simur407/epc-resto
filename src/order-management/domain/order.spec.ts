import { Item, ItemId } from './item';
import {
  Order,
  OrderDelivered,
  OrderId,
  OrderInPreparation,
  OrderPickedUp,
  OrderPlaced,
  OrderPrepared,
} from './order';

const menu = {
  ramen: [
    {
      name: 'Spicy Miso Tonkotsu Ramen',
      price: 1150,
    },
    {
      name: 'Shoyu Ramen with Grilled Chicken',
      price: 980,
    },
  ],
  sushi: [
    {
      name: 'Chirashi Sushi',
      price: 2380,
    },
    {
      name: 'Uni and Toro Sushi',
      price: 320,
    },
  ],
};

describe('Order', () => {
  describe('place an order', () => {
    test('can place order with items', () => {
      // given
      const items = [
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.ramen[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.sushi[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 4,
          ...menu.sushi[1],
        }),
      ];
      // when
      const order = Order.place({ id: OrderId.new(), items });
      // then
      expect(order.getEvents()).toMatchObject([
        new OrderPlaced(
          order.id.toString(),
          items.map((i) => i.toObject()),
        ),
      ]);
    });

    test('cannot place order with no items', () => {
      // given
      const items: Item[] = [];
      // when
      const placeOrder = () => Order.place({ id: OrderId.new(), items });
      // then
      expect(placeOrder).toThrow('Order has to have at least one item');
    });
  });

  describe('starting prepration', () => {
    test('placed order could be prepared', () => {
      // given
      const items = [
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.ramen[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.sushi[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 4,
          ...menu.sushi[1],
        }),
      ];
      const order = Order.place({ id: OrderId.new(), items });
      order.getEvents();
      // when
      order.startPreparing();
      // then
      expect(order.getEvents()).toMatchObject([
        new OrderInPreparation(order.id.toString()),
      ]);
    });

    test('cannot prepre order that is alrady in preparation', () => {
      // given
      const items = [
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.ramen[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.sushi[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 4,
          ...menu.sushi[1],
        }),
      ];
      const order = Order.place({ id: OrderId.new(), items });
      order.startPreparing();
      order.getEvents();
      // when
      const startPreparing = () => order.startPreparing();
      // then
      expect(startPreparing).toThrow(
        'No longer possible to start preparing food',
      );
    });
  });

  describe('finish preparation', () => {
    test('can finish preparation of order that was in preparation', () => {
      // given
      const items = [
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.ramen[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.sushi[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 4,
          ...menu.sushi[1],
        }),
      ];
      const order = Order.place({ id: OrderId.new(), items });
      order.startPreparing();
      order.getEvents();
      // when
      order.finishPreparation();
      // then
      expect(order.getEvents()).toMatchObject([
        new OrderPrepared(order.id.toString()),
      ]);
    });

    test('cannot finish preparation of order that is not in preparation', () => {
      // given
      const items = [
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.ramen[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.sushi[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 4,
          ...menu.sushi[1],
        }),
      ];
      const order = Order.place({ id: OrderId.new(), items });
      order.getEvents();
      // when
      const finishPreparation = () => order.finishPreparation();
      // then
      expect(finishPreparation).toThrow('Order is not in the kitchen');
    });
  });

  describe('pick up', () => {
    test('can pick up order that is perpared', () => {
      // given
      const items = [
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.ramen[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.sushi[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 4,
          ...menu.sushi[1],
        }),
      ];
      const order = Order.place({ id: OrderId.new(), items });
      order.startPreparing();
      order.finishPreparation();
      order.getEvents();
      // when
      order.pickUp();
      // then
      expect(order.getEvents()).toMatchObject([
        new OrderPickedUp(order.id.toString()),
      ]);
    });

    test('cannot pick up order that is not perpared yet', () => {
      // given
      const items = [
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.ramen[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.sushi[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 4,
          ...menu.sushi[1],
        }),
      ];
      const order = Order.place({ id: OrderId.new(), items });
      order.startPreparing();
      order.getEvents();
      // when
      const pickUp = () => order.pickUp();
      // then
      expect(pickUp).toThrow('Cannot pick up that order');
    });
  });

  describe('deliver', () => {
    test('can deliver order that is picked up', () => {
      // given
      const items = [
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.ramen[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.sushi[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 4,
          ...menu.sushi[1],
        }),
      ];
      const order = Order.place({ id: OrderId.new(), items });
      order.startPreparing();
      order.finishPreparation();
      order.pickUp();
      order.getEvents();
      // when
      order.deliver();
      // then
      expect(order.getEvents()).toMatchObject([
        new OrderDelivered(order.id.toString()),
      ]);
    });

    test('cannot deliver order that is not picked up', () => {
      // given
      const items = [
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.ramen[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 1,
          ...menu.sushi[0],
        }),
        Item.create({
          id: ItemId.new(),
          quantity: 4,
          ...menu.sushi[1],
        }),
      ];
      const order = Order.place({ id: OrderId.new(), items });
      order.startPreparing();
      order.finishPreparation();
      order.getEvents();
      // when
      const deliver = () => order.deliver();
      // then
      expect(deliver).toThrow('Order is not in deliery');
    });
  });
});
