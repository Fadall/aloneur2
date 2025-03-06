import { MapPin, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DeliveryInfo = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          Suivez votre commande en direct
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Localisation en temps réel</h3>
            <p className="text-gray-600">
              Suivez votre commande sur la carte en temps réel
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Estimation précise</h3>
            <p className="text-gray-600">
              Recevez une estimation précise du temps de livraison
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Livraison rapide</h3>
            <p className="text-gray-600">
              Nos livreurs s'engagent à vous livrer dans les meilleurs délais
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Button 
            variant="default"
            onClick={() => navigate("/delivery-tracking")}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Suivre ma livraison
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DeliveryInfo;