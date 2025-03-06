
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'larger';
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  screenReader: false,
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Chargement des paramètres en fonction de l'utilisateur connecté
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      // Charger les paramètres de l'utilisateur connecté
      const savedSettings = localStorage.getItem(`accessibility_${userProfile.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        // Si aucun paramètre pour cet utilisateur, utiliser les valeurs par défaut
        setSettings(defaultSettings);
      }
    } else {
      // Si l'utilisateur est déconnecté, réinitialiser aux valeurs par défaut
      setSettings(defaultSettings);
    }
  }, [isAuthenticated, userProfile]);

  // Sauvegarde des paramètres lorsqu'ils changent
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      localStorage.setItem(`accessibility_${userProfile.id}`, JSON.stringify(settings));
    }
  }, [settings, isAuthenticated, userProfile]);

  // Appliquer les paramètres au document
  useEffect(() => {
    // Apply font size
    document.documentElement.classList.remove('text-base', 'text-lg', 'text-xl');
    switch (settings.fontSize) {
      case 'large':
        document.documentElement.classList.add('text-lg');
        break;
      case 'larger':
        document.documentElement.classList.add('text-xl');
        break;
      default:
        document.documentElement.classList.add('text-base');
    }

    // Apply high contrast - Amélioration de l'impact visuel
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
      // Ajouter des styles spécifiques pour un meilleur contraste
      document.querySelectorAll('button').forEach(button => {
        button.classList.add('high-contrast-button');
      });
      document.querySelectorAll('a').forEach(link => {
        link.classList.add('high-contrast-link');
      });
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.querySelectorAll('.high-contrast-button').forEach(button => {
        button.classList.remove('high-contrast-button');
      });
      document.querySelectorAll('.high-contrast-link').forEach(link => {
        link.classList.remove('high-contrast-link');
      });
    }

    // Apply reduced motion - Amélioration de l'impact sur les animations
    if (settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
      // Désactiver spécifiquement certaines animations
      document.querySelectorAll('.animate-spin, .animate-pulse, .animate-bounce').forEach(element => {
        element.classList.add('motion-reduced');
      });
    } else {
      document.documentElement.classList.remove('reduce-motion');
      document.querySelectorAll('.motion-reduced').forEach(element => {
        element.classList.remove('motion-reduced');
      });
    }

    // Apply screen reader support - Amélioration de l'accessibilité
    if (settings.screenReader) {
      document.documentElement.setAttribute('role', 'application');
      // Ajouter des attributs ARIA plus significatifs
      const buttons = document.querySelectorAll('button:not([aria-label])');
      buttons.forEach(button => {
        if (button.textContent) {
          button.setAttribute('aria-label', button.textContent.trim());
        }
      });
      
      // Ajouter des attributs ARIA aux images sans alt
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach(img => {
        img.setAttribute('alt', 'Image ' + (img.getAttribute('src')?.split('/').pop() || ''));
      });
      
      // Améliorer la navigation au clavier
      const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
      interactiveElements.forEach(element => {
        if (!element.getAttribute('tabindex')) {
          element.setAttribute('tabindex', '0');
        }
      });
      
      // Ajouter des régions ARIA pour améliorer la navigation
      document.querySelectorAll('nav').forEach(nav => {
        nav.setAttribute('aria-label', 'Navigation principale');
      });
      document.querySelectorAll('main').forEach(main => {
        main.setAttribute('role', 'main');
      });
      document.querySelectorAll('footer').forEach(footer => {
        footer.setAttribute('role', 'contentinfo');
      });
    } else {
      // Nettoyer les attributs ARIA ajoutés
      document.documentElement.removeAttribute('role');
      document.querySelectorAll('[aria-label]').forEach(element => {
        if (element.tagName !== 'BUTTON' || !element.getAttribute('data-permanent-aria')) {
          element.removeAttribute('aria-label');
        }
      });
    }
  }, [settings]);

  const updateSettings = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
