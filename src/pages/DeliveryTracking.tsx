
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Clock, Phone, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { indexedDBService } from "@/services/indexedDBService";

interface CartItem {
  id: string;
  dish: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
  };
  quantity: number;
  order_id?: string;
}

const DeliveryTracking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, userProfile } = useAuth();
  const [currentOrder, setCurrentOrder] = useState<CartItem[]>([]);
  const [orderDetails, setOrderDetails] = useState<{ id: string, status: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirection si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page"
      });
      navigate("/login");
      return;
    }

    // Charger la commande en cours
    const fetchOrder = async () => {
      if (!userProfile) return;
      
      try {
        setIsLoading(true);
        
        // Get user's orders
        const userOrders = await indexedDBService.getUserOrders(userProfile.id);
        const pendingOrder = userOrders.find(order => order.status === 'EN_COURS');
        
        if (pendingOrder) {
          setOrderDetails(pendingOrder);
          
          // Get order details with dish information
          const orderDetails = await indexedDBService.getOrderDetails(pendingOrder.id);
          
          if (orderDetails && orderDetails.length > 0) {
            const orderItems: CartItem[] = [];
            
            for (const detail of orderDetails) {
              const dish = await indexedDBService.getDish(detail.plat_id);
              if (dish) {
                orderItems.push({
                  id: detail.id,
                  dish: {
                    id: dish.id,
                    name: dish.name,
                    description: dish.description || null,
                    price: dish.price,
                    image_url: dish.image_url || null,
                  },
                  quantity: detail.quantity,
                  order_id: pendingOrder.id
                });
              }
            }
            
            setCurrentOrder(orderItems);
          }
        } else {
          // Si pas de commande en cours, rediriger vers le panier
          toast({
            variant: "destructive",
            title: "Aucune commande en cours",
            description: "Vous n'avez pas de commande en cours à suivre"
          });
          navigate('/cart');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les informations de la commande"
        });
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [isAuthenticated, navigate, toast, userProfile]);

  // Données mockées pour la démonstration
  const deliveryInfo = {
    orderId: orderDetails?.id || "CMD-123456",
    status: "En cours de livraison",
    estimatedTime: "15-20 minutes",
    driver: {
      name: "Aziz Dabo",
      phone: "+221 78 231 59 40",
      location: { lat: 48.8566, lng: 2.3522 }
    },
    customer: {
      address: "Gibraltar, Dakar",
      location: { lat: 48.8584, lng: 2.3536 }
    }
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="container py-8 mt-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const totalPrice = currentOrder.reduce((total, item) => total + (item.dish.price * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Carte de suivi */}
        <Card>
          <CardHeader>
            <CardTitle>Localisation en temps réel</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Carte de suivi en temps réel</p>
          </CardContent>
        </Card>

        {/* Informations de livraison */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de la livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Commande #{deliveryInfo.orderId}</h3>
                  <div className="text-lg font-medium text-primary">
                    {deliveryInfo.status}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Temps estimé</p>
                      <p className="text-gray-600">{deliveryInfo.estimatedTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Adresse de livraison</p>
                      <p className="text-gray-600">{deliveryInfo.customer.address}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Informations du livreur</h4>
                    <div className="space-y-3">
                      <p className="font-medium">{deliveryInfo.driver.name}</p>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <p className="text-gray-600">{deliveryInfo.driver.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Détails de la commande</h4>
                    {currentOrder.length > 0 ? (
                      <div className="space-y-3">
                        {currentOrder.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <div className="flex items-center space-x-2">
                              <ShoppingBag className="w-4 h-4 text-primary" />
                              <span>
                                {item.dish.name} x{item.quantity}
                              </span>
                            </div>
                            <span className="font-medium">
                              {(item.dish.price * item.quantity).toFixed(2)} €
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-2 border-t mt-2">
                          <span className="font-semibold">Total</span>
                          <span className="font-semibold">{totalPrice.toFixed(2)} €</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucun détail de commande disponible</p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryTracking;
