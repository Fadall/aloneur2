
import { useState, useEffect, createContext, useContext } from 'react';
import { authService, User } from '@/services/authService';
import { remoteDBService } from '@/services/remoteDBService';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (userData: { first_name: string; last_name: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<User | null>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userProfile: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: async () => null,
  updatePassword: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Utiliser le service distant pour vérifier l'authentification
          const user = await remoteDBService.verifyToken(token);
          if (user) {
            setIsAuthenticated(true);
            setUserProfile(user);
            return;
          }
          
          // Fallback to authService
          const authUser = await authService.verifyToken(token);
          if (authUser) {
            setIsAuthenticated(true);
            setUserProfile(authUser);
          } else {
            // Token invalide
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Authentication verification error:", error);
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
          setUserProfile(null);
        }
      }
    };

    checkAuthentication();
  }, []);

  const login = async (phone: string, password: string): Promise<boolean> => {
    try {
      // Utiliser le service distant pour la connexion
      const result = await remoteDBService.login(phone, password);
      if (result) {
        localStorage.setItem('auth_token', result.token);
        setIsAuthenticated(true);
        setUserProfile(result.user);
        return true;
      }
      
      // Fallback to authService
      const authResult = await authService.login(phone, password);
      if (!authResult) return false;
      
      localStorage.setItem('auth_token', authResult.token);
      setIsAuthenticated(true);
      setUserProfile(authResult.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: { 
    first_name: string;
    last_name: string;
    phone: string;
    password: string;
  }): Promise<boolean> => {
    try {
      // Utiliser le service distant pour l'inscription
      const result = await remoteDBService.register(userData);
      if (!result) return false;
      
      // Ensuite enregistrer dans authService (mémoire)
      await authService.register(userData);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  const updateProfile = async (data: Partial<User>): Promise<User | null> => {
    if (!userProfile) return null;
    
    try {
      // If phone number is updated, we need to update the authentication credentials
      if (data.phone && data.phone !== userProfile.phone) {
        console.log("Updating phone number from", userProfile.phone, "to", data.phone);
        
        // Update using remote service
        const updatedUser = await remoteDBService.updateUser(userProfile.id, data);
        
        // Then update in authService
        const authUpdatedUser = await authService.updateProfile(userProfile.id, data);
        
        if (updatedUser) {
          setUserProfile(updatedUser);
        } else if (authUpdatedUser) {
          setUserProfile(authUpdatedUser);
        }
        
        return updatedUser || authUpdatedUser;
      } else {
        // Standard profile update without phone change
        // Update using remote service
        const updatedUser = await remoteDBService.updateUser(userProfile.id, data);
        
        // Then update in authService
        const authUpdatedUser = await authService.updateProfile(userProfile.id, data);
        
        if (updatedUser) {
          setUserProfile(updatedUser);
        } else if (authUpdatedUser) {
          setUserProfile(authUpdatedUser);
        }
        
        return updatedUser || authUpdatedUser;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error; // Re-throw to allow proper error handling
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!userProfile) return false;
    
    try {
      // Check password with the remote service
      const user = await remoteDBService.getUser(userProfile.id);
      
      if (user && user.password === currentPassword) {
        // Update password using remote service
        await remoteDBService.updateUser(userProfile.id, { password: newPassword });
        
        // Update in authService as well
        await authService.updatePassword(userProfile.id, currentPassword, newPassword);
        
        // Déconnecter l'utilisateur automatiquement
        logout();
        return true;
      }
      
      // Fallback to authService
      const authServiceSuccess = await authService.updatePassword(
        userProfile.id,
        currentPassword,
        newPassword
      );
      
      if (authServiceSuccess) {
        logout();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Update password error:', error);
      throw error; // Re-throw to allow proper error handling
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        userProfile, 
        login, 
        register, 
        logout,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
