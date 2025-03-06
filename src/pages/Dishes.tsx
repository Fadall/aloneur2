import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DishCard from "@/components/DishCard";
import OrderDialog from "@/components/OrderDialog";
import { useAuth } from "@/hooks/useAuth";
import { remoteDBService } from "@/services/remoteDBService";
import { type Dish } from "@/data/dishes";

const Dishes = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchParams] = useSearchParams();
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useAuth();
  const { toast } = useToast();

  const { data: dishes = [], isLoading, refetch } = useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const fetchedDishes = await remoteDBService.getDishes();
      return fetchedDishes.map(dish => ({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        image_url: dish.image_url,
        quantity: 1
      })) as Dish[];
    }
  });

  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated && userProfile) {
        const userFavorites = await remoteDBService.getUserFavorites(userProfile.id);
        setFavorites(userFavorites.map(dish => dish.id));
      }
    };
    
    loadFavorites();
  }, [isAuthenticated, userProfile]);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery && dishes) {
      const matchingDishes = dishes.filter(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDishes(matchingDishes);
      
      if (matchingDishes.length === 0) {
        toast({
          title: "Aucun résultat",
          description: `Aucun plat trouvé avec le nom "${searchQuery}"`,
        });
      }
    } else {
      setFilteredDishes(dishes);
    }
  }, [searchParams, dishes, toast]);

  const toggleFavorite = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris",
      });
      navigate("/login");
      return;
    }

    if (!userProfile) return;
    
    const isFavorite = favorites.includes(id);
    
    if (isFavorite) {
      await remoteDBService.removeFavorite(userProfile.id, id);
      setFavorites(prev => prev.filter(fId => fId !== id));
    } else {
      await remoteDBService.addFavorite(userProfile.id, id);
      setFavorites(prev => [...prev, id]);
    }
  };

  const handleConfirmOrder = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter au panier",
      });
      navigate("/login");
      return;
    }

    if (!userProfile || !selectedDish) return;

    try {
      await remoteDBService.addToCart(userProfile.id, selectedDish.id, quantity);
      
      toast({
        title: "Commande confirmée",
        description: `${quantity}x ${selectedDish.name} ajouté au panier`,
      });
      
      setSelectedDish(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout au panier",
      });
    }
  };

  const handleSelectDish = (dish: Dish) => {
    setSelectedDish(dish);
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <div className="container py-16 mt-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16 mt-16">
      <h1 className="text-3xl font-bold mb-8">Nos Plats</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDishes.map((dish) => (
          <div key={dish.id} className="relative">
            <button
              onClick={() => toggleFavorite(dish.id)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md z-10"
            >
              <Heart
                className={favorites.includes(dish.id) ? "fill-red-500 text-red-500" : "text-gray-500"}
                size={20}
              />
            </button>
            <DishCard
              dish={dish}
              isHovered={false}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              onClick={() => handleSelectDish(dish)}
            />
          </div>
        ))}
      </div>

      <OrderDialog
        dish={selectedDish}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={() => setSelectedDish(null)}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
};

export default Dishes;
