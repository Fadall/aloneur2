
import React from "react";
import { Button } from "@/components/ui/button";
import CartItem from "./CartItem";
import { type Dish as CartDish } from "@/data/dishes";

interface CartItem {
  id: string;
  dish: CartDish;
  quantity: number;
}

interface CartItemsSectionProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => Promise<boolean | void>;
  onRemoveFromCart: (itemId: string) => Promise<boolean | void>;
  onValidateOrder: () => Promise<void>;
}

const CartItemsSection = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onValidateOrder 
}: CartItemsSectionProps) => {
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.dish.price * item.quantity, 
    0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Articles dans votre panier</h2>
      <div className="space-y-4">
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item) => (
              <CartItem 
                key={item.id}
                id={item.id}
                dish={item.dish}
                quantity={item.quantity}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveFromCart={onRemoveFromCart}
              />
            ))}
            <div className="flex justify-between items-center pt-4">
              <p className="font-semibold">Total:</p>
              <p className="text-xl font-bold">
                {totalAmount.toFixed(2)} €
              </p>
            </div>
            <Button
              onClick={onValidateOrder}
              className="w-full mt-4"
            >
              Valider la commande
            </Button>
          </>
        ) : (
          <p className="text-gray-500">Votre panier est vide</p>
        )}
      </div>
    </div>
  );
};

export default CartItemsSection;
