// Mock database des utilisateurs
const users = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    phone: '123456789',
    password: 'password123',
    image_url: null
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '987654321',
    password: 'password456',
    image_url: null
  }
];

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  image_url: string | null;
}

// Fonction simplifiée pour simuler JWT sans utiliser le package jsonwebtoken
const createToken = (payload: object): string => {
  // En production, vous auriez une véritable implémentation JWT côté serveur
  // Cette version simplifiée encode simplement l'objet en base64
  return btoa(JSON.stringify(payload));
};

const verifyToken = (token: string): any => {
  try {
    // Décodage du token base64
    return JSON.parse(atob(token));
  } catch (error) {
    return null;
  }
};

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  ingredients: string[];
  quantity?: number; // Added quantity as optional to match with data/dishes.ts
  is_favorite?: boolean;
}

// Mock database of dishes - this should already exist in the file
const dishes: Dish[] = [
  // Mock data for dishes
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil.',
    price: 12.99,
    category: 'Pizza',
    image_url: 'https://example.com/margherita.jpg',
    ingredients: ['tomato sauce', 'mozzarella', 'basil']
  },
  {
    id: '2',
    name: 'Burger Deluxe',
    description: 'Juicy beef burger with cheddar, lettuce, tomato, and bacon.',
    price: 14.99,
    category: 'Burgers',
    image_url: 'https://example.com/burger.jpg',
    ingredients: ['beef patty', 'cheddar', 'lettuce', 'tomato', 'bacon']
  },
  {
    id: '3',
    name: 'Sushi Platter',
    description: 'Assortment of fresh sushi rolls and nigiri.',
    price: 19.99,
    category: 'Sushi',
    image_url: 'https://example.com/sushi.jpg',
    ingredients: ['rice', 'fish', 'seaweed']
  },
  {
    id: '4',
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with eggs, cheese, pancetta, and black pepper.',
    price: 13.99,
    category: 'Pasta',
    image_url: 'https://example.com/carbonara.jpg',
    ingredients: ['pasta', 'eggs', 'cheese', 'pancetta', 'black pepper']
  },
  {
    id: '5',
    name: 'Chicken Caesar Salad',
    description: 'Crisp romaine lettuce with grilled chicken, croutons, and Caesar dressing.',
    price: 11.99,
    category: 'Salads',
    image_url: 'https://example.com/caesar.jpg',
    ingredients: ['romaine lettuce', 'chicken', 'croutons', 'Caesar dressing']
  },
  {
    id: '6',
    name: 'Vegetarian Curry',
    description: 'Spicy vegetable curry with rice and naan bread.',
    price: 15.99,
    category: 'Curry',
    image_url: 'https://example.com/curry.jpg',
    ingredients: ['vegetables', 'rice', 'naan bread', 'spices']
  },
  {
    id: '7',
    name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie with vanilla ice cream.',
    price: 7.99,
    category: 'Desserts',
    image_url: 'https://example.com/brownie.jpg',
    ingredients: ['chocolate', 'vanilla ice cream']
  },
  {
    id: '8',
    name: 'Iced Coffee',
    description: 'Refreshing iced coffee with milk and sugar.',
    price: 4.99,
    category: 'Drinks',
    image_url: 'https://example.com/coffee.jpg',
    ingredients: ['coffee', 'milk', 'sugar']
  },
];

// Mock cart and favorites data
const carts: { userId: string; items: { id: string; quantity: number; order_id?: string }[] }[] = [];
const favorites: { userId: string; dishes: string[] }[] = [];
const orders: { id: string; userId: string; items: { id: string; quantity: number }[]; status: string }[] = [];

export const dishService = {
  getDishes: async (): Promise<Dish[]> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return dishes;
  },

  getDish: async (id: string): Promise<Dish | undefined> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return dishes.find(dish => dish.id === id);
  },

  searchDishes: async (query: string): Promise<Dish[]> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    const normalizedQuery = query.toLowerCase();
    return dishes.filter(dish =>
      dish.name.toLowerCase().includes(normalizedQuery) ||
      dish.description.toLowerCase().includes(normalizedQuery) ||
      dish.ingredients.some(ingredient => ingredient.toLowerCase().includes(normalizedQuery))
    );
  },

  getCart: async (userId: string) => {
    // Find user's cart or create a new one
    let cart = carts.find(cart => cart.userId === userId);
    if (!cart) {
      cart = { userId, items: [] };
      carts.push(cart);
    }

    // Transform cart items to include dish details
    const cartItems = await Promise.all(
      cart.items.map(async item => {
        const dish = dishes.find(d => d.id === item.id);
        if (!dish) return null;
        return {
          ...dish,
          quantity: item.quantity,
          order_id: item.order_id
        };
      })
    );

    return { items: cartItems.filter(Boolean) };
  },

  updateCartItemQuantity: async (userId: string, itemId: string, newQuantity: number) => {
    const cart = carts.find(cart => cart.userId === userId);
    if (!cart) return false;

    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;

    cart.items[itemIndex].quantity = newQuantity;
    return true;
  },

  removeFromCart: async (userId: string, itemId: string) => {
    const cart = carts.find(cart => cart.userId === userId);
    if (!cart) return false;

    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;

    cart.items.splice(itemIndex, 1);
    return true;
  },

  getUserFavorites: async (userId: string) => {
    const userFavorites = favorites.find(f => f.userId === userId);
    if (!userFavorites) return [];

    return dishes.filter(dish => userFavorites.dishes.includes(dish.id));
  },

  toggleFavorite: async (userId: string, dishId: string) => {
    let userFavorites = favorites.find(f => f.userId === userId);
    if (!userFavorites) {
      userFavorites = { userId, dishes: [] };
      favorites.push(userFavorites);
    }

    const dishIndex = userFavorites.dishes.indexOf(dishId);
    if (dishIndex >= 0) {
      userFavorites.dishes.splice(dishIndex, 1);
    } else {
      userFavorites.dishes.push(dishId);
    }

    return true;
  },

  getCurrentOrder: async (userId: string) => {
    const userOrder = orders.find(order => order.userId === userId && order.status !== 'COMPLETED');
    
    if (!userOrder) return null;

    const orderItems = await Promise.all(
      userOrder.items.map(async item => {
        const dish = dishes.find(d => d.id === item.id);
        if (!dish) return null;
        return {
          ...dish,
          quantity: item.quantity,
          order_id: userOrder.id
        };
      })
    );

    return { items: orderItems.filter(Boolean), status: userOrder.status };
  },

  validateOrder: async (userId: string) => {
    const cart = carts.find(cart => cart.userId === userId);
    if (!cart || cart.items.length === 0) return false;

    // Create new order
    const orderId = `order-${Date.now()}`;
    orders.push({
      id: orderId,
      userId,
      items: [...cart.items],
      status: 'EN_COURS'
    });

    // Clear cart
    cart.items = [];
    
    return true;
  },

  addToCart: async (userId: string, dishId: string, quantity: number) => {
    // Find the dish first
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return false;

    // Find user's cart or create a new one
    let cart = carts.find(cart => cart.userId === userId);
    if (!cart) {
      cart = { userId, items: [] };
      carts.push(cart);
    }

    // Check if dish is already in cart
    const existingItemIndex = cart.items.findIndex(item => item.id === dishId);
    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ id: dishId, quantity });
    }

    return true;
  },

  addToOrder: async (userId: string, dishId: string, quantity: number) => {
    // This is the same as addToCart in our simplified implementation
    return await dishService.addToCart(userId, dishId, quantity);
  }
};
