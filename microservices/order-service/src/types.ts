export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  dataAiHint: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;Act as a Data Privacy Officer. Generate a JSON object representing a valid 'Order' for testing, based on the following TypeScript definitions. 
IMPORTANT: 
1. Ensure all PII (names, emails, addresses) is clearly fake/anonymized (e.g., "User_123", "123 Test St"). 
2. The 'status' must be 'PENDING'. 
3. Include at least 2 'items'. 

TYPESCRIPT DEFINITIONS: 
interface Order { 
id: string; 
userId: string; 
items: OrderItem[]; 
totalAmount: number; 
status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'; shippingAddress: Address; 
createdAt: Date;
}
interface Address 
{ 
street: string; 
city: string; 
state: string; 
zipCode: string; 
country: string;
}
interface OrderItem 
{ 
productId: string; 
quantity: number; 
price: number;
}Act as a Data Privacy Officer. Generate a JSON object representing a valid 'Order' for testing, based on the following TypeScript definitions. 
IMPORTANT: 
1. Ensure all PII (names, emails, addresses) is clearly fake/anonymized (e.g., "User_123", "123 Test St"). 
2. The 'status' must be 'PENDING'. 
3. Include at least 2 'items'. 

TYPESCRIPT DEFINITIONS: 
interface Order { 
id: string; 
userId: string; 
items: OrderItem[]; 
totalAmount: number; 
status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'; shippingAddress: Address; 
createdAt: Date;
}
interface Address 
{ 
street: string; 
city: string; 
state: string; 
zipCode: string; 
country: string;
}
interface OrderItem 
{ 
productId: string; 
quantity: number; 
price: number;
}
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  orderDate: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface OrderResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
