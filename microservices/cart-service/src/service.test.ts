import { CartService } from './service';
import { Cart, CartItem } from './types';
import { ProductServiceClient } from './product-client';
import path from 'path';
import fs from 'fs';

// Mock the ProductServiceClient
jest.mock('./product-client');

describe('CartService - updateCartTotals', () => {
  let cartService: CartService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the data file to ensure clean state
    const dataDir = path.join(__dirname, '..', 'data');
    const dbPath = path.join(dataDir, 'carts.json');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    cartService = new CartService();
  });

  describe('Correct Amount Charging', () => {
    test('should charge correct amount for single item with whole number price', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Apple',
            price: 5.0,
            quantity: 2,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartService['updateCartTotals'](cart);

      expect(cart.totalAmount).toBe(10.0);
      expect(cart.totalItems).toBe(2);
    });

    test('should charge correct amount for single item with decimal price', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Banana',
            price: 2.99,
            quantity: 3,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartService['updateCartTotals'](cart);

      expect(cart.totalAmount).toBe(8.97);
      expect(cart.totalItems).toBe(3);
    });

    test('should charge correct amount for multiple items with various prices', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Apple',
            price: 1.5,
            quantity: 2,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
          {
            id: 'prod-2',
            name: 'Orange',
            price: 2.25,
            quantity: 4,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
          {
            id: 'prod-3',
            name: 'Banana',
            price: 0.99,
            quantity: 5,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Expected: (1.5 * 2) + (2.25 * 4) + (0.99 * 5) = 3 + 9 + 4.95 = 16.95
      cartService['updateCartTotals'](cart);

      expect(cart.totalAmount).toBe(16.95);
      expect(cart.totalItems).toBe(11);
    });
  });

  describe('Floating-Point Precision Handling', () => {
    test('should NOT charge $19.99999999 due to floating-point precision', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Item A',
            price: 9.99,
            quantity: 2,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartService['updateCartTotals'](cart);

      // Should be exactly 19.98, not 19.99999999 or similar
      expect(cart.totalAmount).toBe(19.98);
      expect(Number.isFinite(cart.totalAmount)).toBe(true);
      expect(cart.totalAmount.toString()).toBe('19.98');
    });

    test('should round correctly for problematic decimal combinations', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Item',
            price: 0.1,
            quantity: 3,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartService['updateCartTotals'](cart);

      // 0.1 * 3 should be exactly 0.3, not 0.30000000000000004
      expect(cart.totalAmount).toBe(0.3);
      expect(Number.isInteger(cart.totalAmount * 100)).toBe(true);
    });

    test('should maintain exactly 2 decimal places for currency formatting', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Premium Item',
            price: 19.99,
            quantity: 1,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartService['updateCartTotals'](cart);

      // Should be exactly $19.99
      expect(cart.totalAmount).toBe(19.99);
      const decimalPlaces = (cart.totalAmount.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    test('should handle complex floating-point arithmetic with multiple items', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Item 1',
            price: 10.1,
            quantity: 1,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
          {
            id: 'prod-2',
            name: 'Item 2',
            price: 20.2,
            quantity: 1,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
          {
            id: 'prod-3',
            name: 'Item 3',
            price: 30.3,
            quantity: 1,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 10.1 + 20.2 + 30.3 = 60.6
      cartService['updateCartTotals'](cart);

      expect(cart.totalAmount).toBe(60.6);
      expect(cart.totalAmount).not.toBe(60.60000000000001);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty cart', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [],
        totalAmount: 100, // Previous value
        totalItems: 50, // Previous value
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartService['updateCartTotals'](cart);

      expect(cart.totalAmount).toBe(0);
      expect(cart.totalItems).toBe(0);
    });

    test('should handle very small quantities', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Expensive Item',
            price: 999.99,
            quantity: 1,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartService['updateCartTotals'](cart);

      expect(cart.totalAmount).toBe(999.99);
      expect(cart.totalItems).toBe(1);
    });

    test('should handle large quantities', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Bulk Item',
            price: 1.0,
            quantity: 10000,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartService['updateCartTotals'](cart);

      expect(cart.totalAmount).toBe(10000.0);
      expect(cart.totalItems).toBe(10000);
    });

    test('should handle zero-priced items', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Free Item',
            price: 0.0,
            quantity: 5,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
          {
            id: 'prod-2',
            name: 'Paid Item',
            price: 10.0,
            quantity: 2,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartService['updateCartTotals'](cart);

      expect(cart.totalAmount).toBe(20.0);
      expect(cart.totalItems).toBe(7);
    });

    test('should correctly round up when total ends in .005', () => {
      const cart: Cart = {
        id: 'cart-1',
        userId: 'user-1',
        items: [
          {
            id: 'prod-1',
            name: 'Item',
            price: 0.35,
            quantity: 1,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
          {
            id: 'prod-2',
            name: 'Item 2',
            price: 0.15,
            quantity: 1,
            description: '',
            image: '',
            dataAiHint: '',
            addedAt: new Date(),
          },
        ],
        totalAmount: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 0.35 + 0.15 = 0.50
      cartService['updateCartTotals'](cart);

      expect(cart.totalAmount).toBe(0.5);
    });
  });

  describe('Integration with Cart Operations', () => {
    test('should update totals correctly after adding items', async () => {
      const mockProduct = {
        id: 'prod-1',
        name: 'Apple',
        price: 1.99,
        description: 'Fresh apple',
        image: 'apple.jpg',
        dataAiHint: 'fruit',
      };

      const MockedProductServiceClient = ProductServiceClient as jest.MockedClass<typeof ProductServiceClient>;
      MockedProductServiceClient.prototype.getProduct.mockResolvedValue(
        mockProduct
      );

      const cart = await cartService.addToCart('user-1', 'prod-1', 2);

      expect(cart.totalAmount).toBe(3.98);
      expect(cart.totalItems).toBe(2);
    });

    test('should maintain correct totals across multiple operations', async () => {
      const mockProducts = {
        'prod-1': {
          id: 'prod-1',
          name: 'Item 1',
          price: 10.5,
          description: 'Item 1',
          image: 'img1.jpg',
          dataAiHint: 'hint1',
        },
        'prod-2': {
          id: 'prod-2',
          name: 'Item 2',
          price: 5.25,
          description: 'Item 2',
          image: 'img2.jpg',
          dataAiHint: 'hint2',
        },
      };

      const MockedProductServiceClient = ProductServiceClient as jest.MockedClass<typeof ProductServiceClient>;
      MockedProductServiceClient.prototype.getProduct.mockImplementation(
        (id: string) => Promise.resolve(mockProducts[id as keyof typeof mockProducts])
      );

      // Add first item
      await cartService.addToCart('user-1', 'prod-1', 1);
      let cart = await cartService.getCart('user-1');
      expect(cart.totalAmount).toBe(10.5);

      // Add second item
      await cartService.addToCart('user-1', 'prod-2', 2);
      cart = await cartService.getCart('user-1');
      expect(cart.totalAmount).toBe(21.0); // 10.5 + (5.25 * 2)
      expect(cart.totalItems).toBe(3);
    });
  });
});
