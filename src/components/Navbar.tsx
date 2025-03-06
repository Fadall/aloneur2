
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthStatus } from "./ui/navbar/auth-status";
import { SearchBar } from "./ui/navbar/search-bar";
import { MobileMenu } from "./ui/navbar/mobile-menu";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dishes?search=${encodeURIComponent(searchQuery.trim())}`);
      toast({
        title: "Recherche",
        description: `Recherche en cours pour : ${searchQuery}`
      });
      setSearchQuery("");
    }
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour accéder au panier"
      });
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  const showSearch = ["/", "/dishes"].includes(location.pathname);

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
            <img
              src="https://www.lelexique.ch/wp-content/uploads/2014/08/la-carte-e1435496995517-300x300.png"
              alt="Logo"
              className="h-16 w-16 object-contain"
            />
            <Link to="/" className="text-2xl font-bold text-primary">
              A' loneur !
            </Link>
          </div>

          {showSearch && (
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              handleSearch={handleSearch}
            />
          )}

          <div className="hidden md:flex items-center space-x-4">
            {location.pathname !== "/cart" && (
              <Button variant="ghost" onClick={handleCartClick}>
                <ShoppingCart className="mr-2" size={20} />
                Panier
              </Button>
            )}
            
            <AuthStatus />
          </div>

          <MobileMenu
            isLoggedIn={isAuthenticated}
            userProfile={null}
            showSearch={showSearch}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            handleSearch={handleSearch}
            handleLogout={logout}
            handleCartClick={handleCartClick}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
