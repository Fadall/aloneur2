// IndexedDB database configuration
const DB_NAME = 'livraisonApp';
const DB_VERSION = 1;

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  password?: string;
  image_url: string | null;
  privacy_settings?: string; // Pour stocker les paramètres de confidentialité
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

export interface CartItem {
  id: string;
  dish_id: string;
  user_id: string;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
}

export interface OrderDetail {
  id: string;
  commande_id: string;
  plat_id: string;
  quantity: number;
}

export interface Favorite {
  id: string;
  user_id: string;
  dish_id: string;
}

// Initialize database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject('Database error: ' + (event.target as IDBOpenDBRequest).error);
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('dishes')) {
        db.createObjectStore('dishes', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('cart_items')) {
        const cartStore = db.createObjectStore('cart_items', { keyPath: 'id', autoIncrement: true });
        cartStore.createIndex('user_id', 'user_id', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('orders')) {
        const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
        orderStore.createIndex('user_id', 'user_id', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('order_details')) {
        const detailsStore = db.createObjectStore('order_details', { keyPath: 'id', autoIncrement: true });
        detailsStore.createIndex('commande_id', 'commande_id', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('favorites')) {
        const favoritesStore = db.createObjectStore('favorites', { keyPath: 'id', autoIncrement: true });
        favoritesStore.createIndex('user_id', 'user_id', { unique: false });
        favoritesStore.createIndex('user_dish', ['user_id', 'dish_id'], { unique: true });
      }
    };
  });
};

// Generic function to get the database connection
const getDB = async (): Promise<IDBDatabase> => {
  return await initDB();
};

// Seed initial data
export const seedInitialData = async () => {
  const db = await getDB();
  
  // Sample users
  const sampleUsers: User[] = [
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
  
  // Senegalese dishes
  const sampleDishes: Dish[] = [
    {
      id: '1',
      name: 'Thiebou Djeun',
      description: 'Le thiéboudiène est un plat traditionnel à base de riz et de poisson, emblème de la cuisine sénégalaise.',
      price: 15.99,
      image_url: 'https://www.wathi.org/wp-content/uploads/2020/08/tiep-bou-dieun-1.jpg',
      category: 'Plat Traditionnel',
      ingredients: 'Riz, poisson, légumes, huile, épices'
    },
    {
      id: '2',
      name: 'Petits Fours',
      description: 'Plateau salé succulents et frais. Fataya à la viande salé. Nems à la viande et fruits de mer. Satisfaction Garantie.',
      price: 12.99,
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvKJyc59KEVrWY_42X924h82h_wg0lmwa5yg&s',
      category: 'Entrée',
      ingredients: 'Pâte, viande, fruits de mer, épices'
    },
    {
      id: '3',
      name: 'Thiebou Guinar',
      description: 'Le Thiébou Guinar est un plat avec du riz cuit dans son bouillon de poulet épicé.',
      price: 14.99,
      image_url: 'https://www.cuisinedecheznous.net/wp-content/uploads/2023/01/324735539_540066791385461_7284688279923942582_n.jpg',
      category: 'Plat Traditionnel',
      ingredients: 'Riz, poulet, légumes, épices, huile'
    }
  ];
  
  // Transaction for users
  const userTx = db.transaction('users', 'readwrite');
  const userStore = userTx.objectStore('users');
  
  for (const user of sampleUsers) {
    userStore.put(user);
  }
  
  // Transaction for dishes
  const dishTx = db.transaction('dishes', 'readwrite');
  const dishStore = dishTx.objectStore('dishes');
  
  // Clear existing dishes first
  const clearRequest = dishStore.clear();
  
  clearRequest.onsuccess = () => {
    // Add new dishes after clearing
    for (const dish of sampleDishes) {
      dishStore.put(dish);
    }
  };
  
  return new Promise<void>((resolve, reject) => {
    dishTx.oncomplete = () => resolve();
    dishTx.onerror = () => reject(dishTx.error);
  });
};

// CRUD operations
export const indexedDBService = {
  // Users
  getUser: async (id: string): Promise<User | null> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('users', 'readonly');
      const store = tx.objectStore('users');
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  getUserByPhone: async (phone: string): Promise<User | null> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('users', 'readonly');
      const store = tx.objectStore('users');
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        
        if (cursor) {
          const user = cursor.value;
          
          if (user.phone === phone) {
            resolve(user);
            return;
          }
          
          cursor.continue();
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    const db = await getDB();
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
  };
  
  const id = generateUUID();
  
    
    const user: User = {
      id,
      ...userData
    };
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('users', 'readwrite');
      const store = tx.objectStore('users');
      const request = store.add(user);
      
      request.onsuccess = () => {
        resolve(user);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  updateUser: async (id: string, userData: Partial<User>): Promise<User | null> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('users', 'readwrite');
      const store = tx.objectStore('users');
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const user = getRequest.result as User;
        
        if (!user) {
          resolve(null);
          return;
        }
        
        const updatedUser = { ...user, ...userData };
        const updateRequest = store.put(updatedUser);
        
        updateRequest.onsuccess = () => {
          resolve(updatedUser);
        };
        
        updateRequest.onerror = () => {
          reject(updateRequest.error);
        };
      };
      
      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  },
  
  // Dishes
  getDishes: async (): Promise<Dish[]> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('dishes', 'readonly');
      const store = tx.objectStore('dishes');
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  getDish: async (id: string): Promise<Dish | null> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('dishes', 'readonly');
      const store = tx.objectStore('dishes');
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  // Cart
  addToCart: async (userId: string, dishId: string, quantity: number): Promise<void> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('cart_items', 'readwrite');
      const store = tx.objectStore('cart_items');
      const index = store.index('user_id');
      const request = index.openCursor(IDBKeyRange.only(userId));
      let found = false;
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        
        if (cursor) {
          const cartItem = cursor.value;
          
          if (cartItem.dish_id === dishId) {
            cartItem.quantity += quantity;
            cursor.update(cartItem);
            found = true;
            resolve();
            return;
          }
          
          cursor.continue();
        } else if (!found) {
          store.add({
            user_id: userId,
            dish_id: dishId,
            quantity
          });
          
          resolve();
        }
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  getCart: async (userId: string): Promise<{ id: string; dish: Dish; quantity: number }[]> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['cart_items', 'dishes'], 'readonly');
      const cartStore = tx.objectStore('cart_items');
      const dishStore = tx.objectStore('dishes');
      const index = cartStore.index('user_id');
      const request = index.getAll(IDBKeyRange.only(userId));
      
      request.onsuccess = async () => {
        const cartItems = request.result as CartItem[];
        const result = [];
        
        for (const item of cartItems) {
          const dishRequest = dishStore.get(item.dish_id);
          
          const dish = await new Promise<Dish>((resolveDish, rejectDish) => {
            dishRequest.onsuccess = () => resolveDish(dishRequest.result);
            dishRequest.onerror = () => rejectDish(dishRequest.error);
          });
          
          if (dish) {
            result.push({
              id: item.id.toString(),
              dish,
              quantity: item.quantity
            });
          }
        }
        
        resolve(result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  updateCartItem: async (itemId: string, quantity: number): Promise<void> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction('cart_items', 'readwrite');
        const store = tx.objectStore('cart_items');
        
        // For string or numeric IDs - handle conversion properly
        const id = !isNaN(Number(itemId)) ? Number(itemId) : itemId;
        
        const request = store.get(id);
        
        request.onsuccess = () => {
          const item = request.result;
          
          if (item) {
            item.quantity = quantity;
            const updateRequest = store.put(item);
            
            updateRequest.onsuccess = () => {
              console.log("Cart item updated successfully:", itemId);
              resolve();
            };
            
            updateRequest.onerror = (error) => {
              console.error("Error updating cart item:", error);
              reject(error);
            };
          } else {
            console.error("Cart item not found for ID:", itemId);
            reject(new Error("Item not found"));
          }
        };
        
        request.onerror = (error) => {
          console.error("Error getting cart item:", error);
          reject(error);
        };
        
        tx.oncomplete = () => {
          console.log("Transaction completed successfully for item ID:", itemId);
        };
        
        tx.onerror = (error) => {
          console.error("Transaction error:", error);
        };
      } catch (error) {
        console.error("Exception in updateCartItem:", error);
        reject(error);
      }
    });
  },
  
  removeFromCart: async (itemId: string): Promise<void> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('cart_items', 'readwrite');
      const store = tx.objectStore('cart_items');
      const request = store.delete(itemId);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  clearCart: async (userId: string): Promise<void> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('cart_items', 'readwrite');
      const store = tx.objectStore('cart_items');
      const index = store.index('user_id');
      const request = index.openCursor(IDBKeyRange.only(userId));
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  // Orders
  createOrder: async (userId: string, status = 'EN_ATTENTE'): Promise<string> => {
    const db = await getDB();
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
  };
  
  const id = generateUUID();
  
    
    const order: Order = {
      id,
      user_id: userId,
      status,
      created_at: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('orders', 'readwrite');
      const store = tx.objectStore('orders');
      const request = store.add(order);
      
      request.onsuccess = () => {
        resolve(id);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  addOrderDetail: async (orderId: string, dishId: string, quantity: number): Promise<void> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('order_details', 'readwrite');
      const store = tx.objectStore('order_details');
      const request = store.add({
        commande_id: orderId,
        plat_id: dishId,
        quantity
      });
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  getOrderDetails: async (orderId: string): Promise<OrderDetail[]> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('order_details', 'readonly');
      const store = tx.objectStore('order_details');
      const index = store.index('commande_id');
      const request = index.getAll(IDBKeyRange.only(orderId));
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('orders', 'readonly');
      const store = tx.objectStore('orders');
      const index = store.index('user_id');
      const request = index.getAll(IDBKeyRange.only(userId));
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  // Favorites
  addFavorite: async (userId: string, dishId: string): Promise<void> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('favorites', 'readwrite');
      const store = tx.objectStore('favorites');
      
      // Check if it already exists
      const index = store.index('user_dish');
      const checkRequest = index.get([userId, dishId]);
      
      checkRequest.onsuccess = () => {
        if (checkRequest.result) {
          // Already exists
          resolve();
          return;
        }
        
        // Add new favorite
        store.add({
          user_id: userId,
          dish_id: dishId
        });
        
        resolve();
      };
      
      checkRequest.onerror = () => {
        reject(checkRequest.error);
      };
    });
  },
  
  removeFavorite: async (userId: string, dishId: string): Promise<void> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction('favorites', 'readwrite');
      const store = tx.objectStore('favorites');
      const index = store.index('user_dish');
      const request = index.get([userId, dishId]);
      
      request.onsuccess = () => {
        const favorite = request.result;
        
        if (favorite) {
          store.delete(favorite.id);
        }
        
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  getUserFavorites: async (userId: string): Promise<Dish[]> => {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['favorites', 'dishes'], 'readonly');
      const favoriteStore = tx.objectStore('favorites');
      const dishStore = tx.objectStore('dishes');
      const index = favoriteStore.index('user_id');
      const request = index.getAll(IDBKeyRange.only(userId));
      
      request.onsuccess = async () => {
        const favorites = request.result as Favorite[];
        const result = [];
        
        for (const favorite of favorites) {
          const dishRequest = dishStore.get(favorite.dish_id);
          
          const dish = await new Promise<Dish>((resolveDish, rejectDish) => {
            dishRequest.onsuccess = () => resolveDish(dishRequest.result);
            dishRequest.onerror = () => rejectDish(dishRequest.error);
          });
          
          if (dish) {
            result.push(dish);
          }
        }
        
        resolve(result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  // Authentication
  login: async (phone: string, password: string): Promise<{ token: string; user: User } | null> => {
    const user = await indexedDBService.getUserByPhone(phone);
    
    if (!user || user.password !== password) {
      return null;
    }
    
    // Create simplified token
    const token = btoa(JSON.stringify({ id: user.id, phone: user.phone }));
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword
    };
  },
  
  register: async (userData: { first_name: string; last_name: string; phone: string; password: string }): Promise<boolean> => {
    const existingUser = await indexedDBService.getUserByPhone(userData.phone);
    
    if (existingUser) {
      return false;
    }
    
    await indexedDBService.createUser({
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
      password: userData.password,
      image_url: null
    });
    
    return true;
  },
  
  verifyToken: async (token: string): Promise<User | null> => {
    try {
      const decoded = JSON.parse(atob(token));
      const user = await indexedDBService.getUser(decoded.id);
      
      if (!user) {
        return null;
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  }
};

// Initialize the database and seed data
export const initializeDatabase = async () => {
  await initDB();
  
  try {
    // Force re-seeding to update dishes
    await seedInitialData();
    console.log("Database reinitialized with Senegalese dishes");
  } catch (error) {
    console.error("Error initializing database:", error);
    // Try to seed data anyway
    await seedInitialData();
  }
};

// Call initialization when the module is imported
initializeDatabase().catch(console.error);
