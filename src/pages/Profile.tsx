import { useState } from "react";
import { User, Lock, Eye, Activity, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountSection } from "@/components/profile/AccountSection";
import { PrivacySection } from "@/components/profile/PrivacySection";
import { AccessibilitySection } from "@/components/profile/AccessibilitySection";
import { AccountStatusSection } from "@/components/profile/AccountStatusSection";
import { AboutSection } from "@/components/profile/AboutSection";
import { DeleteAccountSection } from "@/components/profile/DeleteAccountSection";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("account");

  const menuItems = [
    { id: "account", label: "Mon compte", icon: User },
    { id: "privacy", label: "Confidentialité", icon: Lock },
    { id: "accessibility", label: "Accessibilité", icon: Eye },
    { id: "status", label: "Statut du compte", icon: Activity },
    { id: "about", label: "À propos", icon: Info },
    { id: "delete", label: "Supprimer le compte", icon: Trash2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSection />;
      case "privacy":
        return <PrivacySection />;
      case "accessibility":
        return <AccessibilitySection />;
      case "status":
        return <AccountStatusSection />;
      case "about":
        return <AboutSection />;
      case "delete":
        return <DeleteAccountSection />;
      default:
        return null;
    }
  };

  return (
    <div className="container py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">Mon Compte</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <div className="sticky top-24 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;