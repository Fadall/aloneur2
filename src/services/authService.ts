
import { v4 as uuidv4 } from 'uuid';

// Create in-memory database as we can't use SQLite in the browser
let users: User[] = [
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

// Sample dishes data
let dishes = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Tomate, mozzarella, basilic',
    price: 12.99,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    category: 'Pizza',
    ingredients: 'Tomate, mozzarella, basilic, huile d\'olive'
  },
  {
    id: '2',
    name: 'Burger Classique',
    description: 'Steak haché, salade, tomate, oignon',
    price: 14.99,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    category: 'Burger',
    ingredients: 'Steak haché, pain, salade, tomate, oignon, sauce'
  }
];

// Sample orders data
let orders: any[] = [];
let orderDetails: any[] = [];

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  password?: string;
  image_url: string | null;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  ingredients: string;
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

export const authService = {
  login: async (phone: string, password: string): Promise<{ token: string; user: User } | null> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const user = users.find(u => u.phone === phone && u.password === password);
      
      if (!user) {
        return null;
      }
      
      // Créer un token simplifié
      const token = createToken({ 
        id: user.id,
        phone: user.phone
      });
      
      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = { ...user };
      return { 
        token,
        user: userWithoutPassword as User
      };
    } catch (error) {
      console.error('Error during login:', error);
      return null;
    }
  },
  
  register: async (userData: { 
    first_name: string;
    last_name: string;
    phone: string;
    password: string;
  }): Promise<boolean> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = users.find(u => u.phone === userData.phone);
      
      if (existingUser) {
        return false;
      }
      
      // Insérer le nouvel utilisateur
      const userId = uuidv4();
      const newUser = {
        id: userId,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        password: userData.password,
        image_url: null
      };
      
      users.push(newUser);
      
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  },
  
  verifyToken: (token: string): User | null => {
    try {
      const decoded = verifyToken(token);
      const user = users.find(u => u.id === decoded.id);
      
      if (!user) return null;
      
      const { password: _, ...userWithoutPassword } = { ...user };
      return userWithoutPassword as User;
    } catch (error) {
      return null;
    }
  },
  
  // Méthodes supplémentaires pour la gestion utilisateur
  getProfile: async (userId: string): Promise<User | null> => {
    try {
      const user = users.find(u => u.id === userId);
      
      if (!user) return null;
      
      const { password: _, ...userWithoutPassword } = { ...user };
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },
  
  updateProfile: async (userId: string, data: Partial<User>): Promise<User | null> => {
    try {
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return null;
      }
      
      // Update user data
      const updatedUser = {
        ...users[userIndex],
        ...data
      };
      
      users[userIndex] = updatedUser;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = { ...updatedUser };
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  },
  
  // Méthode pour mettre à jour le mot de passe avec déconnexion automatique
  updatePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Vérifier que le mot de passe actuel est correct
      const userIndex = users.findIndex(u => u.id === userId && u.password === currentPassword);
      
      if (userIndex === -1) {
        return false;
      }
      
      // Mettre à jour le mot de passe
      users[userIndex] = {
        ...users[userIndex],
        password: newPassword
      };
      
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  },
  
  // API fictive pour les plats
  getDishes: async (): Promise<Dish[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return dishes;
  },
  
  getDishById: async (id: string): Promise<Dish | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const dish = dishes.find(d => d.id === id);
    return dish || null;
  },
  
  // API fictive pour les commandes
  createOrder: async (userId: string, items: { dishId: string, quantity: number }[]): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orderId = uuidv4();
    const newOrder = {
      id: orderId,
      user_id: userId,
      status: "pending",
      created_at: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    // Créer les détails de la commande
    items.forEach(item => {
      orderDetails.push({
        id: uuidv4(),
        commande_id: orderId,
        plat_id: item.dishId,
        quantity: item.quantity
      });
    });
    
    return orderId;
  },
  
  getUserOrders: async (userId: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return orders
      .filter(order => order.user_id === userId)
      .map(order => {
        const details = orderDetails.filter(detail => detail.commande_id === order.id);
        return {
          ...order,
          items: details.map(detail => {
            const dish = dishes.find(d => d.id === detail.plat_id);
            return {
              dish,
              quantity: detail.quantity
            };
          })
        };
      });
  }
};
