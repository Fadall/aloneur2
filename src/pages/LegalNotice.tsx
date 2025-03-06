import { Shield } from "lucide-react";

const LegalNotice = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Mentions Légales</h1>
      </div>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Éditeur du site</h2>
          <p className="text-gray-600">
            A' loneur !<br />
            Société par Actions Simplifiée<br />
            Capital social : 10 000€<br />
            RCS Paris B XXX XXX XXX<br />
            Siège social : XX rue XXXXX, 75000 Paris
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Hébergement</h2>
          <p className="text-gray-600">
            Le site est hébergé par :<br />
            Société XXXXX<br />
            Adresse : XXXXX<br />
            Téléphone : XX XX XX XX XX
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Protection des données</h2>
          <p className="text-gray-600">
            Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée, 
            vous disposez d'un droit d'accès, de modification et de suppression des données 
            vous concernant. Pour exercer ce droit, veuillez nous contacter par email : 
            contact@aloneur.fr
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Propriété intellectuelle</h2>
          <p className="text-gray-600">
            L'ensemble du contenu de ce site (textes, images, vidéos) est protégé par le 
            droit d'auteur. Toute reproduction, même partielle, est soumise à notre autorisation.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalNotice;