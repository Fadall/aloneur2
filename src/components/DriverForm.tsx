
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const DriverForm = () => {
  const [email, setEmail] = useState("");
  const [showFullForm, setShowFullForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [driverData, setDriverData] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }
    setShowFullForm(true);
  };

  const handleFullFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que tous les champs sont remplis
    if (!driverData.firstName || !driverData.lastName || !driverData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    
    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Candidature envoyée",
        description: "Votre candidature a été envoyée avec succès !",
      });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <Card className="p-8 max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500 h-16 w-16" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Candidature envoyée !</h2>
            <p className="text-gray-600 mb-6">
              Merci pour votre intérêt ! Votre candidature a été reçue et sera traitée dans les meilleurs délais.
              Vous recevrez une réponse par email à l'adresse {email}.
            </p>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setShowFullForm(false);
                setEmail("");
                setDriverData({
                  firstName: "",
                  lastName: "",
                  phone: ""
                });
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Retour
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <img
              src="https://www.shutterstock.com/image-vector/shipping-fast-delivery-man-riding-600nw-1202545720.jpg"
              alt="Livreur"
              className="w-full h-86 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Devenir livreur</h2>
            <ul className="space-y-4 mb-8">
              <li>✓ Vous avez 18 ans ou plus ?</li>
              <li>✓ Propriétaire d'un scooter ?</li>
              <li>✓ A la recherche d'emploi ?</li>
              <li className="font-bold">Postulez dès maintenant !</li>
            </ul>

            {!showFullForm ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Entrez votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                  Postulez
                </Button>
              </form>
            ) : (
              <form onSubmit={handleFullFormSubmit} className="space-y-4">
                <Input 
                  type="text" 
                  placeholder="Prénom" 
                  value={driverData.firstName}
                  onChange={(e) => setDriverData({...driverData, firstName: e.target.value})}
                />
                <Input 
                  type="text" 
                  placeholder="Nom" 
                  value={driverData.lastName}
                  onChange={(e) => setDriverData({...driverData, lastName: e.target.value})}
                />
                <Input 
                  type="tel" 
                  placeholder="Numéro de téléphone" 
                  value={driverData.phone}
                  onChange={(e) => setDriverData({...driverData, phone: e.target.value})}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white hover:font-bold">
                  Rejoignez l'équipe
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DriverForm;
