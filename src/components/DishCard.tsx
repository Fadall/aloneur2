import { Card } from "@/components/ui/card";
import { type Dish } from "@/data/dishes";

interface DishCardProps {
  dish: Dish;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const DishCard = ({ 
  dish, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave, 
  onClick 
}: DishCardProps) => {
  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-transform duration-300 ${
        isHovered ? "scale-105" : ""
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative aspect-video">
        <img
          src={dish.image_url || '/placeholder.svg'}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold">{dish.name}</h3>
        <p className="text-gray-600 mt-2">{dish.description}</p>
        <p className="text-lg font-bold mt-2">{Number(dish.price).toFixed(2)} €</p>
      </div>
    </Card>
  );
};

export default DishCard;