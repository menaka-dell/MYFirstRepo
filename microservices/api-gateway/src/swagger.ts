import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Basket App - API Gateway',
      version: '1.0.0',
      description: 'Unified API documentation for all microservices in the My Basket App. All requests can be routed through this gateway.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'API Gateway (recommended)',
      },
      {
        url: 'http://localhost:3001',
        description: 'Product Service (direct)',
      },
      {
        url: 'http://localhost:3002',
        description: 'Cart Service (direct)',
      },
      {
        url: 'http://localhost:3003',
        description: 'Order Service (direct)',
      },
      {
        url: 'http://localhost:3004',
        description: 'AI Service (direct)',
      },
      {
        url: 'http://localhost:3005',
        description: 'User Service (direct)',
      },
    ],
    tags: [
      {
        name: 'Gateway',
        description: 'API Gateway management endpoints',
      },
      {
        name: 'Auth',
        description: 'Authentication endpoints - Register & Login',
      },
      {
        name: 'Users',
        description: 'User profile management',
      },
      {
        name: 'Products',
        description: 'Product catalog management',
      },
      {
        name: 'Cart',
        description: 'Shopping cart operations (requires authentication)',
      },
      {
        name: 'Orders',
        description: 'Order management (requires authentication)',
      },
      {
        name: 'Recommendations',
        description: 'AI-powered product recommendations (requires authentication)',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token from /api/users/login or /api/users/register. Include as: Authorization: Bearer <token>',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } },
          },
        },
        HealthStatus: {
          type: 'object',
          properties: {
            gateway: { type: 'string', example: 'api-gateway' },
            status: { type: 'string', enum: ['healthy', 'unhealthy'], example: 'healthy' },
            services: {
              type: 'object',
              properties: {
                'product-service': { 
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    responseTime: { type: 'number' },
                  },
                },
                'cart-service': { 
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    responseTime: { type: 'number' },
                  },
                },
                'order-service': { 
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    responseTime: { type: 'number' },
                  },
                },
                'ai-service': { 
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    responseTime: { type: 'number' },
                  },
                },
                'user-service': { 
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    responseTime: { type: 'number' },
                  },
                },
              },
            },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        GatewayInfo: {
          type: 'object',
          properties: {
            gateway: { type: 'string', example: 'api-gateway' },
            version: { type: 'string', example: '1.0.0' },
            services: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  path: { type: 'string' },
                },
              },
            },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        // Auth Schemas
        RegisterRequest: {
          type: 'object',
          required: ['username', 'password', 'name', 'email'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 30, example: 'johndoe' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'johndoe' },
            password: { type: 'string', example: 'password123' },
          },
        },
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user_123' },
            username: { type: 'string', example: 'johndoe' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/UserPublic' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Smith' },
            email: { type: 'string', format: 'email', example: 'john.smith@example.com' },
            password: { type: 'string', minLength: 6, example: 'newpassword123' },
          },
        },
        // Product Schemas
        Product: {
          type: 'object',
          required: ['id', 'name', 'price', 'description', 'image', 'dataAiHint'],
          properties: {
            id: { type: 'string', example: 'prod_123' },
            name: { type: 'string', example: 'Organic Bananas' },
            price: { type: 'number', format: 'float', example: 2.99 },
            description: { type: 'string', example: 'Fresh organic bananas' },
            image: { type: 'string', format: 'uri', example: 'https://example.com/banana.jpg' },
            dataAiHint: { type: 'string', example: 'fruit, organic, potassium' },
            category: { type: 'string', example: 'fruits' },
            inStock: { type: 'boolean', example: true },
          },
        },
        ProductList: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' },
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 100 },
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 20 },
                totalPages: { type: 'number', example: 5 },
              },
            },
          },
        },
        // Cart Schemas
        CartItem: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'prod_123' },
            name: { type: 'string', example: 'Organic Bananas' },
            price: { type: 'number', example: 2.99 },
            description: { type: 'string', example: 'Fresh organic bananas' },
            image: { type: 'string' },
            dataAiHint: { type: 'string' },
            quantity: { type: 'number', example: 2 },
            addedAt: { type: 'string', format: 'date-time' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cart_123' },
            userId: { type: 'string', example: 'user_123' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
            },
            totalAmount: { type: 'number', example: 45.99 },
            totalItems: { type: 'number', example: 10 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AddToCartRequest: {
          type: 'object',
          required: ['productId'],
          properties: {
            productId: { type: 'string', example: 'prod_123' },
            quantity: { type: 'number', example: 1, default: 1 },
          },
        },
        UpdateCartItemRequest: {
          type: 'object',
          required: ['quantity'],
          properties: {
            quantity: { type: 'number', minimum: 0, example: 3 },
          },
        },
        // Order Schemas
        Address: {
          type: 'object',
          required: ['street', 'city', 'state', 'zipCode', 'country'],
          properties: {
            street: { type: 'string', example: '123 Main St' },
            city: { type: 'string', example: 'New York' },
            state: { type: 'string', example: 'NY' },
            zipCode: { type: 'string', example: '10001' },
            country: { type: 'string', example: 'USA' },
          },
        },
        PaymentMethod: {
          type: 'object',
          required: ['type'],
          properties: {
            type: {
              type: 'string',
              enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'],
              example: 'credit_card',
            },
            last4: { type: 'string', example: '4242' },
            brand: { type: 'string', example: 'Visa' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'prod_123' },
            name: { type: 'string', example: 'Organic Bananas' },
            price: { type: 'number', example: 2.99 },
            quantity: { type: 'number', example: 2 },
            image: { type: 'string' },
            description: { type: 'string' },
            dataAiHint: { type: 'string' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'order_123' },
            userId: { type: 'string', example: 'user_123' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' },
            },
            totalAmount: { type: 'number', example: 45.99 },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
              example: 'pending',
            },
            shippingAddress: { $ref: '#/components/schemas/Address' },
            billingAddress: { $ref: '#/components/schemas/Address' },
            paymentMethod: { $ref: '#/components/schemas/PaymentMethod' },
            trackingNumber: { type: 'string' },
            estimatedDelivery: { type: 'string', format: 'date-time' },
            actualDelivery: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateOrderRequest: {
          type: 'object',
          required: ['items', 'shippingAddress', 'billingAddress', 'paymentMethod'],
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' },
            },
            shippingAddress: { $ref: '#/components/schemas/Address' },
            billingAddress: { $ref: '#/components/schemas/Address' },
            paymentMethod: { $ref: '#/components/schemas/PaymentMethod' },
          },
        },
        OrderList: {
          type: 'object',
          properties: {
            orders: {
              type: 'array',
              items: { $ref: '#/components/schemas/Order' },
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
        // AI Schemas
        Suggestion: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Greek Yogurt' },
            reason: { type: 'string', example: 'Pairs well with bananas' },
            category: { type: 'string', example: 'dairy' },
            confidence: { type: 'number', example: 0.85 },
          },
        },
        GrocerySuggestionsRequest: {
          type: 'object',
          properties: {
            cartItems: {
              type: 'array',
              items: { type: 'string' },
              example: ['bananas', 'milk', 'bread'],
              default: [],
            },
          },
        },
        GrocerySuggestionsResponse: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Suggestion' },
            },
            generatedAt: { type: 'string', format: 'date-time' },
            confidence: { type: 'number', example: 0.8 },
          },
        },
        PersonalizedRecommendationsRequest: {
          type: 'object',
          properties: {
            cartItems: {
              type: 'array',
              items: { type: 'string' },
              example: ['bananas', 'milk'],
              default: [],
            },
            userId: { type: 'string', example: 'user_123' },
            maxSuggestions: {
              type: 'number',
              minimum: 1,
              maximum: 20,
              default: 6,
              example: 6,
            },
          },
        },
        PersonalizedRecommendationsResponse: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Suggestion' },
            },
            userId: { type: 'string' },
            generatedAt: { type: 'string', format: 'date-time' },
            confidence: { type: 'number', example: 0.85 },
          },
        },
      },
    },
  },
  apis: ['./src/index.ts'],
};

const swaggerSpec: any = swaggerJsdoc(options);

// Enhance spec with all endpoint documentation
const enhancedSpec: any = {
  ...swaggerSpec,
  paths: {
    // Gateway endpoints
    '/health': {
      get: {
        summary: 'Health check for all services',
        description: 'Check the health status of the API Gateway and all microservices',
        tags: ['Gateway'],
        responses: {
          '200': {
            description: 'All services are healthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthStatus' },
              },
            },
          },
          '503': {
            description: 'One or more services are unhealthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthStatus' },
              },
            },
          },
        },
      },
    },
    '/info': {
      get: {
        summary: 'Gateway information',
        description: 'Get information about the API Gateway and available services',
        tags: ['Gateway'],
        responses: {
          '200': {
            description: 'Gateway information',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GatewayInfo' },
              },
            },
          },
        },
      },
    },
    // Auth endpoints
    '/api/users/register': {
      post: {
        summary: 'Register a new user',
        description: 'Create a new user account',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid input or username/email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/users/login': {
      post: {
        summary: 'Login user',
        description: 'Authenticate with username and password',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/users/verify': {
      get: {
        summary: 'Verify JWT token',
        description: 'Verify if a JWT token is valid and return the associated user',
        tags: ['Auth'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Token is valid',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserPublic' },
              },
            },
          },
          '401': {
            description: 'Invalid or missing token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/users/{userId}': {
      get: {
        summary: 'Get user profile',
        description: 'Retrieve a user profile by ID',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        responses: {
          '200': {
            description: 'User profile retrieved',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserPublic' },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update user profile',
        description: 'Update user profile information',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'User profile updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserPublic' },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete user account',
        description: 'Delete a user account',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        responses: {
          '200': {
            description: 'User deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'User deleted successfully' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    // Product endpoints
    '/api/products': {
      get: {
        summary: 'Get all products',
        description: 'Retrieve a paginated list of products with optional filters',
        tags: ['Products'],
        parameters: [
          {
            in: 'query',
            name: 'category',
            schema: { type: 'string' },
            description: 'Filter by category',
          },
          {
            in: 'query',
            name: 'minPrice',
            schema: { type: 'number' },
            description: 'Minimum price filter',
          },
          {
            in: 'query',
            name: 'maxPrice',
            schema: { type: 'number' },
            description: 'Maximum price filter',
          },
          {
            in: 'query',
            name: 'inStock',
            schema: { type: 'boolean' },
            description: 'Filter by stock availability',
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search term for product name/description',
          },
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Page number',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 20, maximum: 100 },
            description: 'Items per page',
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductList' },
              },
            },
          },
          '400': {
            description: 'Invalid query parameters',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        summary: 'Get product by ID',
        description: 'Retrieve a single product by its unique identifier',
        tags: ['Products'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
          },
        ],
        responses: {
          '200': {
            description: 'Product found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    // Cart endpoints
    '/api/cart/{userId}': {
      get: {
        summary: 'Get user cart',
        description: 'Retrieve the shopping cart for a specific user',
        tags: ['Cart'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        responses: {
          '200': {
            description: 'Cart retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cart' },
              },
            },
          },
          '400': {
            description: 'Invalid user ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/cart/{userId}/items': {
      post: {
        summary: 'Add item to cart',
        description: 'Add a product to the user\'s shopping cart',
        tags: ['Cart'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddToCartRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Item added to cart',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cart' },
              },
            },
          },
          '400': {
            description: 'Invalid request data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/cart/{userId}/items/{productId}': {
      put: {
        summary: 'Update cart item quantity',
        description: 'Update the quantity of a product in the shopping cart',
        tags: ['Cart'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
          {
            in: 'path',
            name: 'productId',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCartItemRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Item updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cart' },
              },
            },
          },
          '400': {
            description: 'Invalid request data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Item not found in cart',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Remove item from cart',
        description: 'Remove a product from the user\'s shopping cart',
        tags: ['Cart'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
          {
            in: 'path',
            name: 'productId',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
          },
        ],
        responses: {
          '200': {
            description: 'Item removed from cart',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cart' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Item not found in cart',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/cart/{userId}/clear': {
      delete: {
        summary: 'Clear cart',
        description: 'Remove all items from a user\'s shopping cart',
        tags: ['Cart'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        responses: {
          '200': {
            description: 'Cart cleared',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cart' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    // Order endpoints
    '/api/orders/{userId}': {
      post: {
        summary: 'Create a new order',
        description: 'Create a new order from the user\'s cart',
        tags: ['Orders'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Order created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' },
              },
            },
          },
          '400': {
            description: 'Invalid request data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      get: {
        summary: 'Get user orders',
        description: 'Retrieve all orders for a specific user',
        tags: ['Orders'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        responses: {
          '200': {
            description: 'Orders retrieved',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderList' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/orders/{userId}/{orderId}': {
      get: {
        summary: 'Get order details',
        description: 'Retrieve specific order details',
        tags: ['Orders'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
          {
            in: 'path',
            name: 'orderId',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
          },
        ],
        responses: {
          '200': {
            description: 'Order found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update order status',
        description: 'Update the status of an existing order',
        tags: ['Orders'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
          {
            in: 'path',
            name: 'orderId',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Order status updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' },
              },
            },
          },
          '400': {
            description: 'Invalid request data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Cancel order',
        description: 'Cancel an existing order',
        tags: ['Orders'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
          {
            in: 'path',
            name: 'orderId',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
          },
        ],
        responses: {
          '200': {
            description: 'Order cancelled successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Order cancelled successfully' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    // AI/Recommendations endpoints
    '/api/recommendations/grocery-suggestions': {
      post: {
        summary: 'Get grocery suggestions',
        description: 'Get AI-powered grocery suggestions based on cart items',
        tags: ['Recommendations'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/GrocerySuggestionsRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Suggestions generated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GrocerySuggestionsResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid request data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/recommendations/personalized': {
      post: {
        summary: 'Get personalized recommendations',
        description: 'Get personalized product recommendations based on user history and cart items',
        tags: ['Recommendations'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PersonalizedRecommendationsRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Personalized recommendations generated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PersonalizedRecommendationsResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid request data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
  },
  info: {
    ...swaggerSpec.info,
    description: `${swaggerSpec.info.description}\n\n## Getting Started\n\n### Authentication Flow\n1. Register a new user: \`POST /api/users/register\`\n2. Login: \`POST /api/users/login\`\n3. Use the returned JWT token in the \`Authorization: Bearer <token>\` header for all protected endpoints\n\n### Public Endpoints (No Auth Required)\n- \`GET /api/products\` - Browse all products\n- \`GET /api/products/{id}\` - View product details\n- \`POST /api/users/register\` - Create account\n- \`POST /api/users/login\` - Login\n- \`GET /health\` - Check service health\n- \`GET /info\` - Get gateway information\n\n### Protected Endpoints (Requires Auth)\n- All endpoints under \`/api/cart/\` - Shopping cart operations\n- All endpoints under \`/api/orders/\` - Order management\n- All endpoints under \`/api/recommendations/\` - AI recommendations\n- \`GET /api/users/{userId}\` - User profile operations\n\n## Service Architecture\nThe API Gateway routes requests to individual microservices:\n- **User Service** (Port 3005): Authentication, user profiles\n- **Product Service** (Port 3001): Product catalog\n- **Cart Service** (Port 3002): Shopping cart management\n- **Order Service** (Port 3003): Order management\n- **AI Service** (Port 3004): Recommendations engine`,
  },
};

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(enhancedSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'My Basket App - API Gateway',
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestHeaders: true,
      docExpansion: 'list',
    },
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(enhancedSpec);
  });
};
