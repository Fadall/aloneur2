import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AccountStatusSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Statut du compte</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-white">
            <span>État actuel</span>
            <Badge>Actif</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Complétude du profil</span>
              <span className="text-sm text-muted-foreground">75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Informations manquantes :</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Photo de profil</li>
              <li>Numéro de téléphone vérifié</li>
            </ul>
          </div>

          <div className="pt-4">
            <h4 className="font-medium mb-2">Statistiques du compte</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Membre depuis</p>
                <p className="font-medium">Janvier 2024</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dernière connexion</p>
                <p className="font-medium">Aujourd'hui</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};