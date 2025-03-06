
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { indexedDBService } from "@/services/indexedDBService";

interface PrivacySettings {
  profileVisibility: boolean;
  activityVisibility: boolean;
  searchVisibility: boolean;
  emailVisibility: boolean;
}

export const PrivacySection = () => {
  const { userProfile } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: false,
    activityVisibility: false,
    searchVisibility: false, 
    emailVisibility: false
  });

  // Charger les paramètres depuis la base de données au chargement
  useEffect(() => {
    const loadSettings = async () => {
      if (userProfile) {
        try {
          // Récupérer les paramètres de confidentialité de l'utilisateur
          const user = await indexedDBService.getUser(userProfile.id);
          if (user && user.privacy_settings) {
            setSettings(JSON.parse(user.privacy_settings));
          }
        } catch (error) {
          console.error("Erreur lors du chargement des paramètres de confidentialité:", error);
        }
      }
    };

    loadSettings();
  }, [userProfile]);

  const handleSave = async () => {
    if (userProfile) {
      try {
        // Sauvegarder dans IndexedDB
        await indexedDBService.updateUser(userProfile.id, {
          privacy_settings: JSON.stringify(settings)
        });
        
        toast({
          title: "Confidentialité",
          description: "Paramètres de confidentialité mis à jour et sauvegardés",
        });
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des paramètres de confidentialité:", error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les paramètres de confidentialité",
          variant: "destructive"
        });
      }
    }
  };

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Paramètres de confidentialité</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="profile-visibility">Profil public</Label>
          <Switch 
            id="profile-visibility" 
            checked={settings.profileVisibility}
            onCheckedChange={() => handleToggle('profileVisibility')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="activity-visibility">Activité visible</Label>
          <Switch 
            id="activity-visibility" 
            checked={settings.activityVisibility}
            onCheckedChange={() => handleToggle('activityVisibility')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="search-visibility">Visible dans les recherches</Label>
          <Switch 
            id="search-visibility" 
            checked={settings.searchVisibility}
            onCheckedChange={() => handleToggle('searchVisibility')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="email-visibility">Adresse email visible</Label>
          <Switch 
            id="email-visibility" 
            checked={settings.emailVisibility}
            onCheckedChange={() => handleToggle('emailVisibility')}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} className="w-full text-white">
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};
