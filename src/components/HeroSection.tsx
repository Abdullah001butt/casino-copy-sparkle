import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Trophy, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-casino-purple/20 to-casino-red/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1)_0%,transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="  text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="neon-text animate-neon-glow">LEARN & WIN</span>
              <br />
              <span className="gold-gradient bg-clip-text text-transparent">
                Play Smart
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Master casino strategies with expert guides and tips. 
            <span className="text-casino-gold font-semibold"> Learn from the pros</span> 
            and improve your gaming knowledge!
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center space-x-2 text-casino-neon">
              <Zap className="h-5 w-5" />
              <span>Expert Strategies</span>
            </div>
            <div className="flex items-center space-x-2 text-casino-gold">
              <Trophy className="h-5 w-5" />
              <span>Pro Tips & Guides</span>
            </div>
            <div className="flex items-center space-x-2 text-casino-neon-pink">
              <Sparkles className="h-5 w-5" />
              <span>Latest Casino News</span>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="gold-gradient text-black font-bold text-lg px-8 py-4 hover:scale-105 transition-all duration-300 animate-shimmer bg-[length:200%_100%]"
              onClick={() => window.location.href = '/blog'}
            >
              📚 Read Expert Guides
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black font-semibold text-lg px-8 py-4 transition-all duration-300"
              onClick={() => window.location.href = '/blog?category=strategies'}
            >
              🎯 Learn Strategies
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center text-sm text-gray-400">
            <p className="mb-2">📖 Expert Content • 🎓 Educational Resources • 🏆 Pro Tips</p>
            <p>Join thousands of players improving their casino knowledge</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
