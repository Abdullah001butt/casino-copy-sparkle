
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Star, TrendingUp } from 'lucide-react';

const PopularGames = () => {
  const games = [
    {
      id: 1,
      title: 'Mega Fortune Dreams',
      category: 'Progressive Slots',
      rtp: '96.4%',
      jackpot: '$2.1M',
      image: '🎰',
      hot: true
    },
    {
      id: 2,
      title: 'Lightning Blackjack',
      category: 'Live Casino',
      rtp: '99.5%',
      multiplier: '500x',
      image: '♠️',
      hot: false
    },
    {
      id: 3,
      title: 'Book of Golden Pharaoh',
      category: 'Adventure Slots',
      rtp: '96.8%',
      feature: 'Free Spins',
      image: '📚',
      hot: true
    },
    {
      id: 4,
      title: 'European Roulette Pro',
      category: 'Table Games',
      rtp: '97.3%',
      feature: 'Live Dealer',
      image: '🎲',
      hot: false
    },
    {
      id: 5,
      title: 'Wild West Gold Rush',
      category: 'Western Slots',
      rtp: '96.5%',
      feature: 'Bonus Rounds',
      image: '🤠',
      hot: true
    },
    {
      id: 6,
      title: 'Baccarat Squeeze',
      category: 'Live Casino',
      rtp: '98.9%',
      feature: 'HD Streaming',
      image: '🃏',
      hot: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900/50 to-black/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-casino-neon" />
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">Popular </span>
              <span className="neon-text">Games</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join millions of players in our most exciting games. High RTP, huge jackpots, and non-stop action!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="casino-card group hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Game Image/Icon */}
                <div className="relative bg-gradient-to-br from-casino-purple/30 to-casino-red/30 h-40 flex items-center justify-center">
                  <div className="text-6xl">{game.image}</div>
                  {game.hot && (
                    <div className="absolute top-3 right-3 bg-casino-red text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      🔥 HOT
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                    <Button 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 gold-gradient text-black font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Play Now
                    </Button>
                  </div>
                </div>

                {/* Game Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white text-lg leading-tight">
                      {game.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-casino-gold">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>

                  <p className="text-casino-neon text-sm mb-3">{game.category}</p>

                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-400">RTP: </span>
                      <span className="text-casino-gold font-semibold">{game.rtp}</span>
                    </div>
                    <div>
                      {game.jackpot && (
                        <>
                          <span className="text-gray-400">Jackpot: </span>
                          <span className="text-casino-neon font-semibold">{game.jackpot}</span>
                        </>
                      )}
                      {game.multiplier && (
                        <>
                          <span className="text-gray-400">Max Win: </span>
                          <span className="text-casino-neon font-semibold">{game.multiplier}</span>
                        </>
                      )}
                      {game.feature && (
                        <>
                          <span className="text-gray-400">Feature: </span>
                          <span className="text-casino-gold font-semibold">{game.feature}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="gold-gradient text-black font-bold text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
          >
            🎮 View All 2,000+ Games
          </Button>
          <p className="text-gray-400 mt-4">
            New games added weekly • Exclusive titles • Mobile optimized
          </p>
        </div>
      </div>
    </section>
  );
};

export default PopularGames;
