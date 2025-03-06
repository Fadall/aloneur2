
// This file simulates a Supabase client using IndexedDB
import { indexedDBService } from '@/services/indexedDBService';

// Mock implementation of basic Supabase client functions using IndexedDB
export const supabase = {
  from: (table: string) => {
    return {
      select: (columns = '*') => {
        return {
          async single() {
            // This implementation is simplified and doesn't handle the columns parameter
            return { data: null, error: null };
          },
          async then(resolve: (result: { data: any; error: any }) => void) {
            try {
              let data = null;
              
              if (table === 'dishes') {
                data = await indexedDBService.getDishes();
              } else if (table === 'users') {
                // This would typically require more parameters
                // For now just return empty array
                data = [];
              }
              
              resolve({ data, error: null });
            } catch (error) {
              resolve({ data: null, error });
            }
          }
        };
      },
      insert: (rows: any[]) => {
        return {
          select: () => {
            return {
              async single() {
                try {
                  if (table === 'orders') {
                    const orderId = await indexedDBService.createOrder(rows[0].user_id, rows[0].status);
                    return { 
                      data: { id: orderId, ...rows[0] }, 
                      error: null 
                    };
                  }
                  
                  return { data: null, error: 'Table not implemented' };
                } catch (error) {
                  return { data: null, error };
                }
              }
            };
          },
          async then(resolve: (result: { data: any; error: any }) => void) {
            try {
              let data = null;
              
              if (table === 'order_details') {
                // Handle order details
                await indexedDBService.addOrderDetail(
                  rows[0].commande_id,
                  rows[0].plat_id,
                  rows[0].quantity
                );
                data = rows;
              }
              
              resolve({ data, error: null });
            } catch (error) {
              resolve({ data: null, error });
            }
          }
        };
      }
    };
  },
  auth: {
    getUser: async () => {
      return { data: { user: null }, error: null };
    },
    signOut: async () => {
      return { error: null };
    }
  }
};
