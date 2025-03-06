
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { remoteDBService } from "@/services/remoteDBService";
import { type Dish as CartDish } from "@/data/dishes";
import CartItemsSection from "@/components/cart/CartItemsSection";
import CurrentOrderSection from "@/components/cart/CurrentOrderSection";
import FavoritesSection from "@/components/cart/FavoritesSection";

interface CartItem {
  id: string;
  dish: CartDish;
  quantity: number;
  order_id?: string;
}

const Cart = () => {
  const [favorites, setFavorites] = useState<CartDish[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [isAuthenticated, navigate]);

  const fetchUserData = async () => {
    try {
      if (!userProfile) return;

      setIsLoading(true);

      const userFavorites = await remoteDBService.getUserFavorites(userProfile.id);
      const formattedFavorites: CartDish[] = userFavorites.map(dish => ({
        id: dish.id,
        name: dish.name,
        description: dish.description || null,
        price: dish.price,
        image_url: dish.image_url || null,
        quantity: 0
      }));
      setFavorites(formattedFavorites);

      const cart = await remoteDBService.getCart(userProfile.id);
      console.log("Cart items:", cart);
      
      const formattedCartItems: CartItem[] = cart.map(item => ({
        id: item.id,
        dish: {
          id: item.dish.id,
          name: item.dish.name,
          description: item.dish.description || null,
          price: item.dish.price,
          image_url: item.dish.image_url || null,
          quantity: item.quantity
        },
        quantity: item.quantity
      }));
      setCartItems(formattedCartItems);

      const userOrders = await remoteDBService.getUserOrders(userProfile.id);
      const pendingOrder = userOrders.find(order => order.status === 'EN_COURS');
      
      if (pendingOrder) {
        const orderDetails = await remoteDBService.getOrderDetails(pendingOrder.id);
        
        if (orderDetails && orderDetails.length > 0) {
          const orderItems: CartItem[] = [];
          
          for (const detail of orderDetails) {
            const dish = await remoteDBService.getDish(detail.plat_id);
            if (dish) {
              orderItems.push({
                id: detail.id,
                dish: {
                  id: dish.id,
                  name: dish.name,
                  description: dish.description || null,
                  price: dish.price,
                  image_url: dish.image_url || null,
                  quantity: detail.quantity
                },
                quantity: detail.quantity,
                order_id: pendingOrder.id
              });
            }
          }
          
          setCurrentOrder(orderItems);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement du panier",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleValidateOrder = async () => {
    try {
      if (!userProfile || cartItems.length === 0) return;

      setIsLoading(true);

      const orderId = await remoteDBService.createOrder(userProfile.id, 'EN_COURS');
      
      for (const item of cartItems) {
        await remoteDBService.addOrderDetail(orderId, item.dish.id, item.quantity);
      }
      
      await remoteDBService.clearCart(userProfile.id);
      
      toast({
        title: "Succès",
        description: "Votre commande a été validée avec succès",
      });
      
      setIsLoading(false);
      
      navigate('/delivery-tracking');
    } catch (error) {
      console.error('Error validating order:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation de la commande",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      if (!userProfile) return;

      if (newQuantity <= 0) {
        await handleRemoveFromCart(itemId);
        return;
      }

      await remoteDBService.updateCartItem(itemId, newQuantity);
      
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      toast({
        title: "Panier mis à jour",
        description: "La quantité a été mise à jour",
      });
      
      return false;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la quantité",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      if (!userProfile) return;

      await remoteDBService.removeFromCart(itemId);
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

      toast({
        title: "Article supprimé",
        description: "L'article a été retiré du panier",
      });
      
      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'article",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const handleRemoveFavorite = async (dishId: string) => {
    try {
      if (!userProfile) return;

      await remoteDBService.removeFavorite(userProfile.id, dishId);
      
      setFavorites(prevFavorites => prevFavorites.filter(dish => dish.id !== dishId));

      toast({
        title: "Favori supprimé",
        description: "Le plat a été retiré de vos favoris",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du favori",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 mt-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>
      <div className="flex flex-col space-y-8">
        <CartItemsSection 
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onValidateOrder={handleValidateOrder}
        />

        <CurrentOrderSection 
          currentOrder={currentOrder}
        />

        <FavoritesSection 
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorite}
        />
      </div>
    </div>
  );
};

export default Cart;
