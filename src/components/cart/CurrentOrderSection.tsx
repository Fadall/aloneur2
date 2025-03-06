
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import OrderItem from "./OrderItem";
import { type Dish as CartDish } from "@/data/dishes";

interface CartItem {
  id: string;
  dish: CartDish;
  quantity: number;
  order_id?: string;
}

interface CurrentOrderSectionProps {
  currentOrder: CartItem[];
}

const CurrentOrderSection = ({ currentOrder }: CurrentOrderSectionProps) => {
  const navigate = useNavigate();
  const totalAmount = currentOrder.reduce(
    (total, item) => total + item.dish.price * item.quantity, 
    0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Commande en cours</h2>
      <div className="space-y-4">
        {currentOrder.length > 0 ? (
          <>
            {currentOrder.map((item) => (
              <OrderItem 
                key={item.id}
                id={item.id}
                dish={item.dish}
                quantity={item.quantity}
              />
            ))}
            <div className="flex justify-between items-center pt-4">
              <p className="font-semibold">Total de la commande:</p>
              <p className="text-xl font-bold">
                {totalAmount.toFixed(2)} €
              </p>
            </div>
            <Button
              onClick={() => navigate('/delivery-tracking')}
              className="w-full mt-4"
            >
              Suivre la livraison
            </Button>
          </>
        ) : (
          <p className="text-gray-500">Aucune commande en cours</p>
        )}
      </div>
    </div>
  );
};

export default CurrentOrderSection;
