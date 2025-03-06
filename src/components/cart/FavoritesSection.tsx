
import React from "react";
import FavoriteItem from "./FavoriteItem";
import { type Dish as CartDish } from "@/data/dishes";

interface FavoritesSectionProps {
  favorites: CartDish[];
  onRemoveFavorite: (dishId: string) => Promise<void>;
}

const FavoritesSection = ({ favorites, onRemoveFavorite }: FavoritesSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Plats favoris</h2>
      <div className="space-y-4">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((dish) => (
              <FavoriteItem 
                key={dish.id}
                dish={dish}
                onRemoveFavorite={onRemoveFavorite}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun plat en favori</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesSection;
