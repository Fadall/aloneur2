
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { type Dish as CartDish } from "@/data/dishes";
import { toast } from "@/components/ui/use-toast";

interface CartItemProps {
  id: string;
  dish: CartDish;
  quantity: number;
  onUpdateQuantity: (itemId: string, newQuantity: number) => Promise<boolean | void>;
  onRemoveFromCart: (itemId: string) => Promise<boolean | void>;
}

const CartItem = ({ id, dish, quantity, onUpdateQuantity, onRemoveFromCart }: CartItemProps) => {
  const handleUpdateQuantity = async (newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await onRemoveFromCart(id);
      } else {
        await onUpdateQuantity(id, newQuantity);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la quantité",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center space-x-4">
        {dish.image_url && (
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div>
          <h3 className="font-medium">{dish.name}</h3>
          <div className="flex items-center mt-2 space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleUpdateQuantity(quantity - 1)}
              type="button"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm">{quantity}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleUpdateQuantity(quantity + 1)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onRemoveFromCart(id)}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <p className="font-semibold">{(dish.price * quantity).toFixed(2)} €</p>
    </div>
  );
};

export default CartItem;
