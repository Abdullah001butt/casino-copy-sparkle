
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BonusOffers from '@/components/BonusOffers';
import PopularGames from '@/components/PopularGames';
import SlotMachines from '@/components/SlotMachines';
import ResponsibleGambling from '@/components/ResponsibleGambling';
import Footer from '@/components/Footer';

const Index = () => {
  console.log('Casino homepage loaded');
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <BonusOffers />
        <PopularGames />
        <SlotMachines />
        <ResponsibleGambling />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
