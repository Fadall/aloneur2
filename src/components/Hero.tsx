import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/b4/24/44/b424446aab4ac314d4fe166fb2d4a5cd.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative container h-full flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Le goût de la proximité
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Commandez local, dégustez exceptionnel
        </p>
        <Button
          variant="outline"
          className="text-white bg-transparent hover:font-bold border-white hover:bg-white hover:text-primary transition-colors"
          onClick={() => navigate("/dishes")}
        >
          Nos Plats
        </Button>
      </div>
    </div>
  );
};

export default Hero;