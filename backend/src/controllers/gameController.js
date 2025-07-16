import Game from '../models/Game.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all games
export const getAllGames = catchAsync(async (req, res, next) => {
  const { category, provider, page = 1, limit = 20, search } = req.query;
  
  // Build filter object
  const filter = { isActive: true };
  
  if (category) filter.category = category;
  if (provider) filter.provider = provider;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const games = await Game.find(filter)
    .sort({ isHot: -1, isFeatured: -1, createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-__v');

  const total = await Game.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: games.length,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: {
      games,
    },
  });
});

// Get single game
export const getGame = catchAsync(async (req, res, next) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      game,
    },
  });
});

// Get popular games
export const getPopularGames = catchAsync(async (req, res, next) => {
  const games = await Game.find({ isActive: true })
    .sort({ 'stats.popularity': -1 })
    .limit(10)
    .select('name slug category provider rtp minBet maxBet images isHot stats');

  res.status(200).json({
    status: 'success',
    results: games.length,
    data: {
      games,
    },
  });
});

// Get featured games
export const getFeaturedGames = catchAsync(async (req, res, next) => {
  const games = await Game.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .select('name slug category provider rtp minBet maxBet images');

  res.status(200).json({
    status: 'success',
    results: games.length,
    data: {
      games,
    },
  });
});

// Get games by category
export const getGamesByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const games = await Game.find({ category, isActive: true })
    .sort({ isHot: -1, createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Game.countDocuments({ category, isActive: true });

  res.status(200).json({
    status: 'success',
    results: games.length,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: {
      games,
    },
  });
});
