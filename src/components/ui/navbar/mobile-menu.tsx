
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isLoggedIn: boolean;
  userProfile: any;
  showSearch: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleLogout: () => void;
  handleCartClick: () => void;
}

export const MobileMenu = ({
  isLoggedIn,
  userProfile,
  showSearch,
  searchQuery,
  onSearchChange,
  handleSearch,
  handleLogout,
  handleCartClick
}: MobileMenuProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        className="p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-16 bg-white shadow-md py-4 px-4">
          {showSearch && (
            <form onSubmit={(e) => {
              handleSearch(e);
              setIsOpen(false);
            }} className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher un plat..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </form>
          )}
          
          {isLoggedIn ? (
            <>
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-2"
                onClick={() => handleMenuItemClick(() => navigate("/profile"))}
              >
                <User className="mr-2" size={20} />
                Mon Profil
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-2"
                onClick={() => handleMenuItemClick(handleLogout)}
              >
                <LogOut className="mr-2" size={20} />
                Déconnexion
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-2"
              onClick={() => handleMenuItemClick(() => navigate("/login"))}
            >
              <User className="mr-2" size={20} />
              Connexion
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => handleMenuItemClick(handleCartClick)}
          >
            <ShoppingCart className="mr-2" size={20} />
            Panier
          </Button>
        </div>
      )}
    </div>
  );
};
