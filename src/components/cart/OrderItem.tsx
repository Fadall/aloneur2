
import React from "react";
import { type Dish as CartDish } from "@/data/dishes";

interface OrderItemProps {
  id: string;
  dish: CartDish;
  quantity: number;
}

const OrderItem = ({ dish, quantity }: OrderItemProps) => {
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
          <p className="text-sm text-gray-500">Quantité: {quantity}</p>
        </div>
      </div>
      <p className="font-semibold">{(dish.price * quantity).toFixed(2)} €</p>
    </div>
  );
};

export default OrderItem;
