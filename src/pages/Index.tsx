import { FC } from "react";
import Hero from "@/components/Hero";
import DishesCarousel from "@/components/DishesCarousel";
import DeliveryInfo from "@/components/DeliveryInfo";
import DriverForm from "@/components/DriverForm";
import HowItWorks from "@/components/HowItWorks";

const Index: FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <Hero />
      <DishesCarousel />
      <DeliveryInfo />
      <HowItWorks />
      <DriverForm />
    </div>
  );
};

export default Index;