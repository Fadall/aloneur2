
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { indexedDBService } from "@/services/indexedDBService";

export const AccountSection = () => {
  const { userProfile, updateProfile, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    originalPhone: "", // Track original phone for reference
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [profileImage, setProfileImage] = useState("https://cdn.icon-icons.com/icons2/2442/PNG/512/edit_profile_user_icon_148629.png");
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Charger les données de l'utilisateur
  useEffect(() => {
    if (userProfile) {
      setUserData({
        firstName: userProfile.first_name || "",
        lastName: userProfile.last_name || "",
        phone: userProfile.phone || "",
        originalPhone: userProfile.phone || "",
      });
      
      if (userProfile.image_url) {
        setProfileImage(userProfile.image_url);
      }
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile) return;
    
    try {
      setIsUpdating(true);
      
      // Check if phone number changed
      const phoneChanged = userData.phone !== userData.originalPhone;
      
      if (phoneChanged) {
        // Verify the phone number isn't already in use by another account
        const existingUser = await indexedDBService.getUserByPhone(userData.phone);
        if (existingUser && existingUser.id !== userProfile.id) {
          toast({
            title: "Erreur",
            description: "Ce numéro de téléphone est déjà utilisé par un autre compte",
            variant: "destructive",
          });
          setIsUpdating(false);
          return;
        }
      }
      
      // Mettre à jour via le service d'authentification (qui met aussi à jour IndexedDB)
      const updatedUser = await updateProfile({
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
      });
      
      if (updatedUser) {
        // Update the originalPhone value to track the new phone
        setUserData(prev => ({
          ...prev,
          originalPhone: userData.phone
        }));
        
        toast({
          title: "Profil",
          description: "Modifications enregistrées avec succès",
        });
        
        if (phoneChanged) {
          toast({
            title: "Important",
            description: "Votre numéro de téléphone a été mis à jour. Veuillez l'utiliser pour votre prochaine connexion.",
          });
        }
      } else {
        throw new Error("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!userProfile) return;
    
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    if (passwords.new.length < 6) {
      toast({
        title: "Erreur",
        description: "Le nouveau mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      // Mettre à jour le mot de passe via le service d'authentification
      const success = await updatePassword(
        passwords.current,
        passwords.new
      );
      
      if (success) {
        toast({
          title: "Succès",
          description: "Mot de passe modifié avec succès. Vous allez être déconnecté.",
        });
        
        // Redirection vers la page de connexion après 2 secondes
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast({
          title: "Erreur",
          description: "Le mot de passe actuel est incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du mot de passe",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userProfile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);
        
        try {
          setIsUpdating(true);
          
          // Mettre à jour l'image de profil via le service d'authentification
          await updateProfile({
            image_url: imageUrl
          });
          
          toast({
            title: "Photo de profil",
            description: "Photo mise à jour avec succès",
          });
        } catch (error) {
          console.error("Error updating profile image:", error);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la mise à jour de la photo",
            variant: "destructive",
          });
        } finally {
          setIsUpdating(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Profil Utilisateur</h2>
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={profileImage}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex flex-col space-y-2">
          <Button variant="outline" onClick={handleImageClick} disabled={isUpdating}>
            Changer la photo
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUpdating}
          />
        </div>
      </div>
      <div className="space-y-4">
        <Input
          placeholder="Prénom"
          value={userData.firstName}
          onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
          disabled={isUpdating}
        />
        <Input
          placeholder="Nom"
          value={userData.lastName}
          onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
          disabled={isUpdating}
        />
        <Input
          placeholder="Téléphone"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          disabled={isUpdating}
        />
        
        {!showPasswordForm ? (
          <Button variant="outline" onClick={() => setShowPasswordForm(true)} disabled={isUpdating}>
            Changer le mot de passe
          </Button>
        ) : (
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium">Changer le mot de passe</h3>
            <Input
              type="password"
              placeholder="Mot de passe actuel"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              disabled={isUpdating}
            />
            <Input
              type="password"
              placeholder="Nouveau mot de passe"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              disabled={isUpdating}
            />
            <Input
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              disabled={isUpdating}
            />
            <div className="flex space-x-2">
              <Button onClick={handlePasswordChange} disabled={isUpdating}>
                {isUpdating ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswords({ current: "", new: "", confirm: "" });
                }}
                disabled={isUpdating}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
        
        <Button onClick={handleSave} className="w-full text-white" disabled={isUpdating}>
          {isUpdating ? "Enregistrement en cours..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
};
