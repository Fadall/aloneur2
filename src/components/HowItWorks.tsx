const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Choisissez vos plats",
      description: "Parcourez notre sélection de restaurants et plats locaux",
      icon: "🍽️",
    },
    {
      number: "2",
      title: "Passez votre commande",
      description: "Ajoutez vos plats au panier et validez votre commande",
      icon: "🛒",
    },
    {
      number: "3",
      title: "Suivez la livraison",
      description: "Suivez votre commande en temps réel jusqu'à votre porte",
      icon: "🚴",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="w-10 h-10 bg-primary font-bold rounded-full flex items-center justify-center mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;