import fs from 'fs';
import path from 'path';
import { CartService } from './service';
import { ProductServiceClient } from './product-client';
import type { Product } from './types';

jest.mock('./product-client');

const mockedProductServiceClient = ProductServiceClient as jest.MockedClass<typeof ProductServiceClient>;

const dataFilePath = path.join(__dirname, '..', 'data', 'carts.json');

const createValidProduct = (overrides?: Partial<Product>): Product => ({
  id: 'prod_1',
  name: 'Test Product',
  price: 10.0,
  description: 'A test product',
  image: 'http://example.com/img.png',
  dataAiHint: 'test',
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  if (fs.existsSync(dataFilePath)) {
    fs.unlinkSync(dataFilePath);
  }
});

afterEach(() => {
  if (fs.existsSync(dataFilePath)) {
    fs.unlinkSync(dataFilePath);
  }
});

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    mockedProductServiceClient.prototype.getProduct = jest.fn();
    mockedProductServiceClient.prototype.getProducts = jest.fn();
    cartService = new CartService();
  });

  test('addToCart with valid product should add item and update totals', async () => {
    const product = createValidProduct({ id: 'p123', price: 5.5 });
    (mockedProductServiceClient.prototype.getProduct as jest.Mock).mockResolvedValue(product);
    (mockedProductServiceClient.prototype.getProducts as jest.Mock).mockResolvedValue([product]);

    const cart = await cartService.addToCart('test-user', 'p123', 2);

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].id).toBe('p123');
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.totalItems).toBe(2);
    expect(cart.totalAmount).toBe(11.0);
    expect(cart.totalAmount).toBeCloseTo(11.0, 2);
    expect(cart.totalAmount.toFixed(2)).toBe('11.00');
    expect(mockedProductServiceClient.prototype.getProduct).toHaveBeenCalledWith('p123');
  });

  test('updateCartItem adjusts quantity and keeps total accuracy', async () => {
    const product = createValidProduct({ id: 'p456', price: 8.25 });
    (mockedProductServiceClient.prototype.getProduct as jest.Mock).mockResolvedValue(product);
    (mockedProductServiceClient.prototype.getProducts as jest.Mock).mockResolvedValue([product]);

    await cartService.addToCart('user-2', 'p456', 1);
    const updatedCart = await cartService.updateCartItem('user-2', 'p456', 3);

    expect(updatedCart.items).toHaveLength(1);
    expect(updatedCart.items[0].quantity).toBe(3);
    expect(updatedCart.totalItems).toBe(3);
    expect(updatedCart.totalAmount).toBe(24.75);
    expect(updatedCart.totalAmount.toFixed(2)).toBe('24.75');
  });

  test('updateCartItem throws when productId is missing from cart', async () => {
    const product = createValidProduct({ id: 'p456', price: 8.25 });
    (mockedProductServiceClient.prototype.getProduct as jest.Mock).mockResolvedValue(product);
    (mockedProductServiceClient.prototype.getProducts as jest.Mock).mockResolvedValue([product]);

    await cartService.addToCart('user-2', 'p456', 1);

    await expect(cartService.updateCartItem('user-2', 'p999', 2)).rejects.toThrow('Item not found in cart');
  });

  test('floating point precision with 3 items priced at 10.99 should stay rounded to 2 decimals', async () => {
    const product = createValidProduct({ id: 'p789', price: 10.99 });
    (mockedProductServiceClient.prototype.getProduct as jest.Mock).mockResolvedValue(product);
    (mockedProductServiceClient.prototype.getProducts as jest.Mock).mockResolvedValue([product]);

    const cart = await cartService.addToCart('user-3', 'p789', 3);

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(3);
    expect(cart.totalItems).toBe(3);
    expect(cart.totalAmount).toBe(32.97);
    expect(cart.totalAmount.toFixed(2)).toBe('32.97');
    expect(cart.totalAmount).toBeCloseTo(32.97, 2);
  });

  test('removeFromCart completely removes item and recalculates totals correctly', async () => {
    const product = createValidProduct({ id: 'p999', price: 15.0 });
    (mockedProductServiceClient.prototype.getProduct as jest.Mock).mockResolvedValue(product);
    (mockedProductServiceClient.prototype.getProducts as jest.Mock).mockResolvedValue([product]);

    // Add item to cart
    await cartService.addToCart('user-4', 'p999', 2);

    // Remove the item
    const updatedCart = await cartService.removeFromCart('user-4', 'p999');

    // Verify item is completely removed
    expect(updatedCart.items).toHaveLength(0);
    expect(updatedCart.items.find(item => item.id === 'p999')).toBeUndefined();

    // Verify totals are recalculated correctly
    expect(updatedCart.totalItems).toBe(0);
    expect(updatedCart.totalAmount).toBe(0);
    expect(updatedCart.totalAmount.toFixed(2)).toBe('0.00');
  });
});
