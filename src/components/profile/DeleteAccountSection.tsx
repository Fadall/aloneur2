import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const DeleteAccountSection = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDeleteRequest = () => {
    if (confirmText.toLowerCase() !== "supprimer") {
      toast({
        title: "Erreur",
        description: "Veuillez écrire 'supprimer' pour confirmer",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Compte",
      description: "Demande de suppression envoyée, vous recrevrez la confirmation par message.",
    });
    setShowConfirmation(false);
    setConfirmText("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-red-600">Supprimer le compte</h2>
      
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>
          La suppression de votre compte est une action irréversible. 
          Toutes vos données seront définitivement effacées.
        </AlertDescription>
      </Alert>

      {!showConfirmation ? (
        <Button 
          variant="destructive" 
          onClick={() => setShowConfirmation(true)}
          className="w-full text-primary"
        >
          Supprimer mon compte
        </Button>
      ) : (
        <div className="space-y-4 border border-red-200 p-4 rounded-md">
          <p className="text-sm">
            Pour confirmer la suppression, écrivez "supprimer" ci-dessous :
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Écrivez 'supprimer'"
            className="border-red-200"
          />
          <div className="flex space-x-2">
            <Button 
              variant="destructive"
              onClick={handleDeleteRequest}
              className="text-primary"
            >
              Confirmer la suppression
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowConfirmation(false);
                setConfirmText("");
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground space-y-2">
        <p>La suppression de votre compte entraînera :</p>
        <ul className="list-disc list-inside space-y-1">
          <li>La suppression de toutes vos données personnelles</li>
          <li>La perte d'accès à tous vos services</li>
          <li>L'annulation de tous vos abonnements actifs</li>
        </ul>
      </div>
    </div>
  );
};