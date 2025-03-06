
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { type Dish } from "@/data/dishes";
import { useEffect } from "react";

interface OrderDialogProps {
  dish: Dish | null;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const OrderDialog = ({
  dish,
  quantity,
  onQuantityChange,
  onClose,
  onConfirm
}: OrderDialogProps) => {
  // Reset quantity to 1 each time a new dish is selected
  useEffect(() => {
    if (dish) {
      onQuantityChange(1);
    }
  }, [dish, onQuantityChange]);

  if (!dish) return null;

  return (
    <Dialog open={dish !== null} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Commander {dish.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Sélectionnez la quantité du plat que vous souhaitez commander
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Description</Label>
            <p className="text-sm text-gray-500">{dish.description}</p>
          </div>
          <div className="space-y-2">
            <Label>Prix unitaire</Label>
            <p className="text-sm font-semibold">{dish.price.toFixed(2)} €</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(quantity - 1)}
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
                className="w-20 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Prix total</Label>
            <p className="text-lg font-bold">{(dish.price * quantity).toFixed(2)} €</p>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={quantity <= 0}
          >
            Ajouter au panier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
