
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Star, Zap, Crown } from 'lucide-react';

const BonusOffers = () => {
  const bonuses = [
    {
      icon: Crown,
      title: 'Welcome Package',
      amount: '$500 + 200 Free Spins',
      description: 'Get a massive welcome bonus on your first deposit. Double your money and spin for free!',
      terms: 'Min deposit $20 | 35x wagering | New players only',
      cta: 'Claim Welcome Bonus',
      highlight: true,
      badge: 'Most Popular'
    },
    {
      icon: Zap,
      title: 'Weekend Reload',
      amount: '50% up to $200',
      description: 'Every weekend, reload your account and get 50% extra to play with your favorite games.',
      terms: 'Min deposit $30 | 30x wagering | Weekends only',
      cta: 'Get Weekend Bonus',
      highlight: false
    },
    {
      icon: Star,
      title: 'VIP Cashback',
      amount: '15% Weekly Cashback',
      description: 'VIP members get up to 15% of their losses back every week. No questions asked!',
      terms: 'VIP status required | Max $1000 | No wagering',
      cta: 'Join VIP Program',
      highlight: false
    }
  ];

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gift className="h-8 w-8 text-casino-gold" />
            <h2 className="text-4xl md:text-5xl font-bold gold-gradient bg-clip-text text-transparent">
              Exclusive Bonuses
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Boost your bankroll with our incredible bonus offers. More money means more chances to win big!
          </p>
        </div>

        {/* Bonus Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {bonuses.map((bonus, index) => (
            <Card 
              key={index} 
              className={`casino-card relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                bonus.highlight ? 'ring-2 ring-casino-gold' : ''
              }`}
            >
              {bonus.badge && (
                <div className="absolute top-4 right-4 bg-casino-red text-white text-xs font-bold px-2 py-1 rounded-full">
                  {bonus.badge}
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <bonus.icon className={`h-12 w-12 ${bonus.highlight ? 'text-casino-gold animate-float' : 'text-casino-neon'}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {bonus.title}
                </CardTitle>
                <div className={`text-3xl font-bold mb-2 ${
                  bonus.highlight ? 'neon-text animate-neon-glow' : 'text-casino-gold'
                }`}>
                  {bonus.amount}
                </div>
              </CardHeader>

              <CardContent className="text-center space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  {bonus.description}
                </p>
                
                <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                  {bonus.terms}
                </div>

                <Button 
                  className={`w-full font-semibold ${
                    bonus.highlight 
                      ? 'gold-gradient text-black hover:scale-105' 
                      : 'bg-casino-neon text-black hover:bg-casino-neon-pink'
                  } transition-all duration-300`}
                >
                  {bonus.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            New to online casinos? Start with our risk-free demo games!
          </p>
          <Button variant="outline" className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black">
            Try Demo Games First
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BonusOffers;
