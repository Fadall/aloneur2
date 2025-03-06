import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Conditions Générales d'Utilisation</h1>
      </div>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
          <p className="text-gray-600">
            En accédant et en utilisant l'application A' loneur !, vous acceptez d'être lié par ces Conditions Générales d'Utilisation. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
          <p className="text-gray-600">
            A' loneur ! est une plateforme de commande et de livraison de plats cuisinés. 
            Nous mettons en relation des clients avec des restaurants et des livreurs partenaires.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Utilisation du service</h2>
          <p className="text-gray-600">
            Pour utiliser nos services, vous devez :
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600">
            <li>Être âgé d'au moins 18 ans</li>
            <li>Fournir des informations exactes et complètes</li>
            <li>Maintenir la confidentialité de votre compte</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Modifications des conditions</h2>
          <p className="text-gray-600">
            Nous nous réservons le droit de modifier ces conditions à tout moment. 
            Les modifications prennent effet dès leur publication sur l'application.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;