import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const AboutSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">À propos</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations légales</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="terms">
              <AccordionTrigger>Conditions d'utilisation</AccordionTrigger>
              <AccordionContent>
                Les conditions d'utilisation définissent les règles et les responsabilités liées à l'utilisation de notre service. 
                En utilisant notre plateforme, vous acceptez de vous conformer à ces conditions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="privacy">
              <AccordionTrigger>Politique de confidentialité</AccordionTrigger>
              <AccordionContent>
                Notre politique de confidentialité détaille comment nous collectons, utilisons et protégeons vos données personnelles. 
                Nous nous engageons à protéger votre vie privée et à assurer la sécurité de vos informations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cookies">
              <AccordionTrigger>Politique des cookies</AccordionTrigger>
              <AccordionContent>
                Notre politique des cookies explique comment nous utilisons les cookies et technologies similaires pour améliorer 
                votre expérience sur notre plateforme.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Version de l'application</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          <p className="text-sm text-muted-foreground">Dernière mise à jour : Janvier 2024</p>
        </CardContent>
      </Card>
    </div>
  );
};