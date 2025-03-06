import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <HelpCircle className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Foire Aux Questions</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="bg-white rounded-lg shadow-md">
            <AccordionTrigger className="px-6">
              Comment passer une commande ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              Pour passer une commande, connectez-vous à votre compte, parcourez notre 
              sélection de plats, ajoutez vos choix au panier, puis suivez les étapes 
              de validation de commande. Le paiement s'effectue de manière sécurisée.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white rounded-lg shadow-md">
            <AccordionTrigger className="px-6">
              Quels sont les délais de livraison ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              Les délais de livraison varient en fonction de votre localisation et du 
              restaurant choisi. Un temps estimé vous est communiqué lors de la validation 
              de votre commande. En moyenne, comptez entre 30 et 45 minutes.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white rounded-lg shadow-md">
            <AccordionTrigger className="px-6">
              Comment suivre ma commande ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              Une fois votre commande validée, vous pouvez suivre son statut en temps 
              réel depuis votre espace personnel. Vous recevrez également des notifications 
              à chaque étape importante de la livraison.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-white rounded-lg shadow-md">
            <AccordionTrigger className="px-6">
              Quels sont les moyens de paiement acceptés ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              Nous acceptons les cartes bancaires (Visa, Mastercard), ainsi que les 
              paiements via des solutions sécurisées comme Apple Pay et Google Pay.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-white rounded-lg shadow-md">
            <AccordionTrigger className="px-6">
              Comment annuler une commande ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              Vous pouvez annuler votre commande dans les 5 minutes suivant sa validation 
              depuis votre espace personnel. Au-delà de ce délai, contactez notre service 
              client pour toute demande d'annulation.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;