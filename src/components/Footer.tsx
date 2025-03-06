import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-primary hover:text-primary/80">
                Facebook
              </a>
              <a href="#" className="text-primary hover:text-primary/80">
                Instagram
              </a>
              <a href="#" className="text-primary hover:text-primary/80">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                CONDITIONS GENERALES D'UTILISATION
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                QUI SOMMES NOUS ?
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/legal" className="text-sm text-gray-600 hover:text-primary">
                MENTIONS LEGALES
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/faq" className="text-sm text-gray-600 hover:text-primary">
                FAQ
              </Link>
            </div>
            <p className="text-sm text-gray-600">
              A' loneur ! © 2024 tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;