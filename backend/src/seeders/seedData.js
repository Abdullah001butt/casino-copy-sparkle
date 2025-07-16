import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from '../models/Game.js';
import Bonus from '../models/Bonus.js';
import connectDB from '../config/database.js';

dotenv.config();

// Sample Games Data
const sampleGames = [
  {
    name: 'Mega Fortune Dreams',
    slug: 'mega-fortune-dreams',
    description: 'Progressive jackpot slot with luxury theme. Win millions with the wheel of fortune bonus!',
    category: 'slots',
    subcategory: 'progressive_slots',
    provider: 'NetEnt',
    gameType: 'both',
    rtp: 96.4,
    volatility: 'high',
    minBet: 0.20,
    maxBet: 400,
    currency: 'USD',
    isActive: true,
    isNew: false,
    isHot: true,
    isFeatured: true,
    stats: {
      totalPlays: 15420,
      totalWagered: 2840000,
      totalPayout: 2738560,
      popularity: 95
    },
    tags: ['progressive', 'jackpot', 'luxury', 'bonus-rounds']
  },
  {
    name: 'Book of Golden Pharaoh',
    slug: 'book-of-golden-pharaoh',
    description: 'Ancient Egypt themed slot with expanding symbols and free spins.',
    category: 'slots',
    subcategory: 'video_slots',
    provider: 'Pragmatic Play',
    gameType: 'both',
    rtp: 96.8,
    volatility: 'very_high',
    minBet: 0.10,
    maxBet: 250,
    currency: 'USD',
    isActive: true,
    isNew: true,
    isHot: true,
    isFeatured: false,
    stats: {
      totalPlays: 8930,
      totalWagered: 1250000,
      totalPayout: 1210000,
      popularity: 88
    },
    tags: ['egypt', 'adventure', 'free-spins', 'expanding-wilds']
  },
  {
    name: 'Wild West Gold Rush',
    slug: 'wild-west-gold-rush',
    description: 'Saddle up for the ultimate western adventure! Sticky wilds and multipliers await.',
    category: 'slots',
    subcategory: 'video_slots',
    provider: 'Play\'n GO',
    gameType: 'both',
    rtp: 96.5,
    volatility: 'medium',
    minBet: 0.25,
    maxBet: 100,
    currency: 'USD',
    isActive: true,
    isNew: false,
    isHot: false,
    isFeatured: true,
    stats: {
      totalPlays: 12340,
      totalWagered: 890000,
      totalPayout: 859150,
      popularity: 82
    },
    tags: ['western', 'sticky-wilds', 'multipliers', 'bonus-rounds']
  },
  {
    name: 'European Roulette Pro',
    slug: 'european-roulette-pro',
    description: 'Classic European Roulette with professional interface and advanced betting options.',
    category: 'table',
    subcategory: 'roulette',
    provider: 'Evolution Gaming',
    gameType: 'both',
    rtp: 97.3,
    volatility: 'medium',
    minBet: 1.00,
    maxBet: 5000,
    currency: 'USD',
    isActive: true,
    isNew: false,
    isHot: false,
    isFeatured: true,
    stats: {
      totalPlays: 23450,
      totalWagered: 4560000,
      totalPayout: 4436880,
      popularity: 91
    },
    tags: ['roulette', 'european', 'classic', 'single-zero']
  },
  {
    name: 'Lightning Blackjack',
    slug: 'lightning-blackjack',
    description: 'Electrifying blackjack variant with random multipliers up to 25x on winning hands!',
    category: 'table',
    subcategory: 'blackjack',
    provider: 'Evolution Gaming',
    gameType: 'real',
    rtp: 98.9,
    volatility: 'low',
    minBet: 5.00,
    maxBet: 2500,
    currency: 'USD',
    isActive: true,
    isNew: true,
    isHot: true,
    isFeatured: true,
    stats: {
      totalPlays: 18920,
      totalWagered: 3780000,
      totalPayout: 3761100,
      popularity: 94
    },
    tags: ['blackjack', 'lightning', 'multipliers', 'live']
  },
  {
    name: 'Starburst',
    slug: 'starburst',
    description: 'The most popular slot of all time! Simple gameplay with expanding wilds.',
    category: 'slots',
    subcategory: 'classic_slots',
    provider: 'NetEnt',
    gameType: 'both',
    rtp: 96.1,
    volatility: 'low',
    minBet: 0.10,
    maxBet: 100,
    currency: 'USD',
    isActive: true,
    isNew: false,
    isHot: false,
    isFeatured: true,
    stats: {
      totalPlays: 45670,
      totalWagered: 2890000,
      totalPayout: 2777290,
      popularity: 98
    },
    tags: ['classic', 'simple', 'expanding-wilds', 'popular']
  }
];

// Sample Bonuses Data
const sampleBonuses = [
  {
    name: 'Welcome Package',
    code: 'WELCOME500',
    type: 'welcome',
    amount: 500,
    percentage: 100,
    freeSpins: 200,
    currency: 'USD',
    wageringRequirement: 35,
    minDeposit: 20,
    maxBonus: 500,
    validFor: 30,
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true,
    requiresCode: true,
    stats: {
      totalClaimed: 1250,
      totalCompleted: 340,
      totalAmount: 625000
    },
    terms: 'Welcome bonus for new players only. Minimum deposit $20. 35x wagering requirement.'
  },
  {
    name: 'Weekend Reload',
    code: 'WEEKEND50',
    type: 'reload',
    percentage: 50,
    freeSpins: 0,
    currency: 'USD',
    wageringRequirement: 30,
    minDeposit: 30,
    maxBonus: 200,
    validFor: 3,
    startDate: new Date(),
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    isActive: true,
    requiresCode: true,
    stats: {
      totalClaimed: 890,
      totalCompleted: 267,
      totalAmount: 178000
    },
    terms: 'Weekend reload bonus available Friday to Sunday. 50% up to $200.'
  },
  {
    name: 'Free Spins Monday',
    code: 'FREEMONDAY',
    type: 'free_spins',
    freeSpins: 50,
    currency: 'USD',
    wageringRequirement: 25,
    minDeposit: 0,
    maxBonus: 0,
    validFor: 7,
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true,
    requiresCode: true,
    stats: {
      totalClaimed: 2340,
      totalCompleted: 1170,
      totalAmount: 0
    },
    terms: 'Free spins every Monday for active players. No deposit required.'
  },
  {
    name: 'VIP Cashback',
    type: 'cashback',
    percentage: 15,
    currency: 'USD',
    wageringRequirement: 1,
    minDeposit: 0,
    maxBonus: 1000,
    validFor: 7,
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true,
    requiresCode: false,
    stats: {
      totalClaimed: 450,
      totalCompleted: 450,
      totalAmount: 67500
    },
    terms: 'Weekly cashback for VIP players. 15% of losses returned every Monday.'
  }
];

// Seeder Functions
const seedGames = async () => {
  try {
    await Game.deleteMany({});
    console.log('🗑️  Cleared existing games');
    
    const games = await Game.insertMany(sampleGames);
    console.log(`🎮 Seeded ${games.length} games successfully`);
    return games;
  } catch (error) {
    console.error('❌ Error seeding games:', error);
    throw error;
  }
};

const seedBonuses = async () => {
  try {
    await Bonus.deleteMany({});
    console.log('🗑️  Cleared existing bonuses');
    
    const bonuses = await Bonus.insertMany(sampleBonuses);
    console.log(`🎁 Seeded ${bonuses.length} bonuses successfully`);
    return bonuses;
  } catch (error) {
    console.error('❌ Error seeding bonuses:', error);
    throw error;
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Seed data
    await seedGames();
    await seedBonuses();
    
    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Games: ${sampleGames.length}`);
    console.log(`   - Bonuses: ${sampleBonuses.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (process.argv[2] === 'seed') {
  seedDatabase();
}

export { seedDatabase, seedGames, seedBonuses };
