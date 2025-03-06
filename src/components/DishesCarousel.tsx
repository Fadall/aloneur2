
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/hooks/useAuth";
import DishCard from "./DishCard";
import OrderDialog from "./OrderDialog";
import { type Dish } from "@/data/dishes";
import { indexedDBService } from "@/services/indexedDBService";

const DishesCarousel = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useAuth();

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const fetchedDishes = await indexedDBService.getDishes();
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

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (selectedDish && userProfile) {
      try {
        // Create a new order
        const orderId = await indexedDBService.createOrder(userProfile.id);
        
        // Add order details
        await indexedDBService.addOrderDetail(orderId, selectedDish.id, quantity);
        
        // Add to cart as well
        await indexedDBService.addToCart(userProfile.id, selectedDish.id, quantity);

        toast({
          title: "Commande ajoutée",
          description: `${quantity}x ${selectedDish.name} ajouté au panier`,
        });
        
        setSelectedDish(null);
        setQuantity(1);
        navigate("/cart");
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'ajout au panier",
          variant: "destructive",
        });
      }
    }
  };

  const handleSelectDish = (dish: Dish) => {
    setSelectedDish(dish);
    setQuantity(1); // Reset quantity to 1 when a new dish is selected
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Plats disponibles</h2>
        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {dishes.map((dish) => (
                <CarouselItem key={dish.id} className="md:basis-1/3">
                <div
                  className={`relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform ${
                    hoveredId === dish.id ? "scale-105" : ""
                  }`}
                  onMouseEnter={() => setHoveredId(dish.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedDish(dish)}
                >
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-110"
                  />
                  {hoveredId === dish.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold">
                      {dish.name}
                    </div>
                  )}
                </div>
              </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      <OrderDialog
        dish={selectedDish}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={() => setSelectedDish(null)}
        onConfirm={handleOrder}
      />
    </section>
  );
};

export default DishesCarousel;
