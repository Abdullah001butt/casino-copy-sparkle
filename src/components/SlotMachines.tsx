
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, DollarSign, Cherry } from 'lucide-react';

const SlotMachines = () => {
  const [spinning, setSpinning] = useState(false);
  const [currentSymbols, setCurrentSymbols] = useState(['🍒', '🍋', '⭐']);
  
  const symbols = ['🍒', '🍋', '⭐', '💎', '🔔', '7️⃣', '🍇', '🍊'];
  
  const slotMachines = [
    {
      name: 'Fortune Spins Deluxe',
      minBet: '$0.20',
      maxWin: '5,000x',
      paylines: 25,
      rtp: '96.7%',
      features: ['Wild Multipliers', 'Free Spins', 'Bonus Rounds']
    },
    {
      name: 'Egyptian Gold Rush',
      minBet: '$0.10',
      maxWin: '10,000x',
      paylines: 50,
      rtp: '97.1%',
      features: ['Expanding Wilds', 'Scatter Pays', 'Progressive Jackpot']
    },
    {
      name: 'Neon Night Vegas',
      minBet: '$0.50',
      maxWin: '2,500x',
      paylines: 15,
      rtp: '96.4%',
      features: ['Sticky Wilds', 'Re-Spins', 'Mystery Symbols']
    }
  ];

  const spinSlots = () => {
    if (spinning) return;
    
    setSpinning(true);
    console.log('Slot machine spinning started');
    
    const spinDuration = 2000;
    const intervals = [];
    
    // Animate each reel
    currentSymbols.forEach((_, index) => {
      const interval = setInterval(() => {
        setCurrentSymbols(prev => {
          const newSymbols = [...prev];
          newSymbols[index] = symbols[Math.floor(Math.random() * symbols.length)];
          return newSymbols;
        });
      }, 100);
      intervals.push(interval);
      
      // Stop each reel at different times for realistic effect
      setTimeout(() => {
        clearInterval(interval);
        if (index === currentSymbols.length - 1) {
          setTimeout(() => {
            setSpinning(false);
            console.log('Slot machine spinning stopped');
          }, 500);
        }
      }, spinDuration + (index * 200));
    });
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,215,0,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(0,255,255,0.1)_0%,transparent_50%)]"></div>
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Cherry className="h-8 w-8 text-casino-red" />
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">Premium </span>
              <span className="text-casino-gold">Slot Machines</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the thrill of Las Vegas with our collection of premium slot machines. 
            Massive jackpots and incredible bonus features await!
          </p>
        </div>

        {/* Interactive Demo Slot */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="slot-machine">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-casino-gold mb-4">Try Our Demo Slot!</h3>
              
              {/* Slot Reels */}
              <div className="flex justify-center space-x-4 mb-6 bg-black rounded-lg p-4">
                {currentSymbols.map((symbol, index) => (
                  <div 
                    key={index}
                    className={`text-4xl p-2 bg-gray-800 rounded border-2 border-casino-gold ${
                      spinning ? 'animate-slot-spin' : ''
                    }`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={spinSlots}
                disabled={spinning}
                className={`w-full font-bold text-lg ${
                  spinning 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'gold-gradient text-black hover:scale-105'
                } transition-all duration-300`}
              >
                {spinning ? '🎰 Spinning...' : '🎰 SPIN TO WIN!'}
              </Button>
              
              <p className="text-xs text-gray-400 mt-2">
                Demo mode - No real money involved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Slot Machine Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {slotMachines.map((slot, index) => (
            <Card key={index} className="casino-card group hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                {/* Slot Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🎰</div>
                  <h3 className="text-xl font-bold text-white mb-2">{slot.name}</h3>
                  <div className="flex justify-center space-x-4 text-sm">
                    <span className="text-casino-gold">
                      <DollarSign className="inline h-4 w-4" />
                      {slot.minBet} min
                    </span>
                    <span className="text-casino-neon">
                      <Zap className="inline h-4 w-4" />
                      {slot.maxWin} max
                    </span>
                  </div>
                </div>

                {/* Slot Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Paylines:</span>
                    <span className="text-casino-gold font-semibold">{slot.paylines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">RTP:</span>
                    <span className="text-casino-neon font-semibold">{slot.rtp}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-casino-gold font-semibold mb-2">Special Features:</h4>
                  <div className="space-y-1">
                    {slot.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="text-sm text-gray-300 flex items-center">
                        <span className="text-casino-neon mr-2">✨</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full gold-gradient text-black font-semibold hover:scale-105 transition-all duration-300">
                    Play Real Money
                  </Button>
                  <Button variant="outline" className="w-full border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black">
                    Try Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16 space-y-6">
          <div className="bg-gradient-to-r from-casino-gold/20 to-casino-neon/20 rounded-lg p-6 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">🎯 Pro Player Tips</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <h4 className="text-casino-gold font-semibold mb-2">💡 Smart Betting:</h4>
                <p className="text-gray-300 text-sm">Start with smaller bets to understand the game mechanics and bonus triggers.</p>
              </div>
              <div>
                <h4 className="text-casino-neon font-semibold mb-2">⏰ Session Management:</h4>
                <p className="text-gray-300 text-sm">Set time and budget limits before playing. Take breaks every 30 minutes.</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-400">
            🔒 All games are tested for fairness • RNG certified • Mobile optimized
          </p>
        </div>
      </div>
    </section>
  );
};

export default SlotMachines;
