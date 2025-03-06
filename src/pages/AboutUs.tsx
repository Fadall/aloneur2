import { Users } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Qui Sommes Nous ?</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
          <p className="text-gray-600">
            A' loneur ! est né d'une vision simple : rendre accessible la livraison de plats cuisinés 
            tout en soutenant les restaurateurs locaux. Notre mission est de créer des connexions 
            significatives entre les clients et les restaurants de leur quartier.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Nos Valeurs</h2>
          <ul className="space-y-4 text-gray-600">
            <li>
              <strong>Proximité :</strong> Nous privilégions les partenariats locaux pour soutenir l'économie de proximité.
            </li>
            <li>
              <strong>Qualité :</strong> Nous sélectionnons rigoureusement nos partenaires pour garantir une expérience exceptionnelle.
            </li>
            <li>
              <strong>Innovation :</strong> Nous investissons dans la technologie pour améliorer continuellement notre service.
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Notre Histoire</h2>
          <p className="text-gray-600">
            Fondée en 2024, A' loneur ! est le fruit d'une collaboration entre passionnés de gastronomie 
            et experts en technologie. Notre plateforme a été conçue pour répondre aux besoins 
            croissants de livraison de repas tout en maintenant une approche personnalisée et locale.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;