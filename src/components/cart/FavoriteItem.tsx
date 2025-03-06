
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { type Dish as CartDish } from "@/data/dishes";

interface FavoriteItemProps {
  dish: CartDish;
  onRemoveFavorite: (dishId: string) => Promise<void>;
}

const FavoriteItem = ({ dish, onRemoveFavorite }: FavoriteItemProps) => {
  return (
    <div className="border rounded-lg p-4 relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => onRemoveFavorite(dish.id)}
      >
        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
      </Button>
      {dish.image_url && (
        <img
          src={dish.image_url}
          alt={dish.name}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="font-medium">{dish.name}</h3>
      <p className="text-sm text-gray-500">{dish.description}</p>
      <p className="font-semibold mt-2">{dish.price.toFixed(2)} €</p>
    </div>
  );
};

export default FavoriteItem;
