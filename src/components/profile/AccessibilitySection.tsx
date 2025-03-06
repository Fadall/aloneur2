
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from 'react';
import { useAccessibility, type AccessibilitySettings } from "@/hooks/useAccessibility";

export const AccessibilitySection = () => {
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const { toast } = useToast();
  
  const handleFontSizeChange = (size: AccessibilitySettings['fontSize']) => {
    updateSettings('fontSize', size);
    toast({
      title: "Taille de texte mise à jour",
      description: "La taille du texte a été modifiée avec succès."
    });
  };
  
  const handleToggle = (key: keyof AccessibilitySettings) => {
    updateSettings(key, !settings[key]);
    const description = getToggleDescription(key, !settings[key]);
    toast({
      title: "Paramètre mis à jour",
      description: description
    });
  };

  const getToggleDescription = (key: keyof AccessibilitySettings, value: boolean): string => {
    if (key === 'highContrast') {
      return value 
        ? "Le mode contraste élevé est activé pour une meilleure lisibilité." 
        : "Le mode contraste élevé est désactivé.";
    } else if (key === 'reduceMotion') {
      return value 
        ? "Les animations sont désactivées pour réduire les mouvements à l'écran." 
        : "Les animations sont réactivées.";
    } else if (key === 'screenReader') {
      return value 
        ? "Support pour lecteur d'écran activé. L'interface est optimisée pour l'accessibilité." 
        : "Support pour lecteur d'écran désactivé.";
    }
    return `Le paramètre a été ${value ? 'activé' : 'désactivé'} avec succès.`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Paramètres d'accessibilité</h2>
        <p className="text-gray-500 mb-6">
          Personnalisez votre expérience pour améliorer l'accessibilité de l'application.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-3">Taille du texte</h3>
          <RadioGroup 
            defaultValue={settings.fontSize} 
            value={settings.fontSize}
            onValueChange={(value) => handleFontSizeChange(value as AccessibilitySettings['fontSize'])}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large">Grand</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="larger" id="larger" />
              <Label htmlFor="larger">Très grand</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Contraste</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">Contraste élevé</Label>
            <Switch 
              id="high-contrast" 
              checked={settings.highContrast}
              onCheckedChange={() => handleToggle('highContrast')}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Améliore la visibilité des éléments avec des contrastes plus marqués et des bordures plus visibles.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Mouvement et animations</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="reduce-motion">Réduire les animations</Label>
            <Switch 
              id="reduce-motion" 
              checked={settings.reduceMotion}
              onCheckedChange={() => handleToggle('reduceMotion')}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Désactive toutes les animations et transitions pour une expérience plus stable et confortable.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Support lecteur d'écran</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="screen-reader">Compatibilité lecteur d'écran</Label>
            <Switch 
              id="screen-reader" 
              checked={settings.screenReader}
              onCheckedChange={() => handleToggle('screenReader')}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Ajoute des attributs ARIA, améliore la navigation au clavier et optimise la structure pour les lecteurs d'écran.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={() => {
            resetSettings();
            toast({
              title: "Paramètres réinitialisés",
              description: "Tous les paramètres d'accessibilité ont été réinitialisés."
            });
          }}
          variant="outline"
        >
          Réinitialiser les paramètres
        </Button>
      </div>
    </div>
  );
};
