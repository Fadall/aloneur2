
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(formData.phone, formData.password);

      if (success) {
        toast({
          title: "Succès",
          description: "Connexion réussie ! Vos données sont synchronisées avec tous vos appareils.",
        });
        
        const lastVisitedPage = localStorage.getItem('lastVisitedPage') || '/';
        navigate(lastVisitedPage);
      } else {
        toast({
          title: "Erreur",
          description: "Numéro de téléphone ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Connexion
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <Input
                type="tel"
                placeholder="Numéro de téléphone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="pl-10"
                disabled={isLoading}
              />
              <Phone className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="pl-10"
                disabled={isLoading}
              />
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          <Button type="submit" className="w-full text-white hover:font-bold" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
