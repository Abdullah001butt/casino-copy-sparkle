
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Crown, Sparkles } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-casino-gold/20 bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Crown className="h-8 w-8 text-casino-gold animate-float" />
              <Sparkles className="h-4 w-4 text-casino-neon absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-2xl font-bold gold-gradient bg-clip-text text-transparent">
              Royal Casino
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-casino-gold transition-colors">Casino</a>
            <a href="#" className="text-white hover:text-casino-gold transition-colors">Sports</a>
            <a href="#" className="text-white hover:text-casino-gold transition-colors">Live Casino</a>
            <a href="#" className="text-white hover:text-casino-gold transition-colors">Promotions</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black">
              Log In
            </Button>
            <Button className="gold-gradient text-black font-semibold hover:scale-105 transition-transform">
              Join Now - $500 Bonus!
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-casino-gold/20">
              <div className="flex flex-col space-y-6 mt-8">
                <a href="#" className="text-white hover:text-casino-gold transition-colors text-lg">Casino</a>
                <a href="#" className="text-white hover:text-casino-gold transition-colors text-lg">Sports</a>
                <a href="#" className="text-white hover:text-casino-gold transition-colors text-lg">Live Casino</a>
                <a href="#" className="text-white hover:text-casino-gold transition-colors text-lg">Promotions</a>
                <div className="pt-4 space-y-3">
                  <Button variant="outline" className="w-full border-casino-gold text-casino-gold">
                    Log In
                  </Button>
                  <Button className="w-full gold-gradient text-black font-semibold">
                    Join Now - $500 Bonus!
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
