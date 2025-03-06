export interface Dish {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  price: number;
  quantity: number;
}