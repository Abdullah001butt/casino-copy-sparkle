import Bonus from '../models/Bonus.js';
import User from '../models/User.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all active bonuses
export const getAllBonuses = catchAsync(async (req, res, next) => {
  const bonuses = await Bonus.find({
    isActive: true,
    startDate: { $lte: new Date() },
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: new Date() } }
    ]
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: bonuses.length,
    data: {
      bonuses,
    },
  });
});

// Get bonus by ID
export const getBonus = catchAsync(async (req, res, next) => {
  const bonus = await Bonus.findById(req.params.id);

  if (!bonus) {
    return next(new AppError('Bonus not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      bonus,
    },
  });
});

// Claim bonus (protected route)
export const claimBonus = catchAsync(async (req, res, next) => {
  const { bonusId, code } = req.body;
  const userId = req.user.id;

  // Find bonus
  const bonus = await Bonus.findById(bonusId);

  if (!bonus) {
    return next(new AppError('Bonus not found', 404));
  }

  // Check if bonus is active
  if (!bonus.isActive) {
    return next(new AppError('Bonus is not active', 400));
  }

  // Check if bonus requires code
  if (bonus.requiresCode && bonus.code !== code) {
    return next(new AppError('Invalid bonus code', 400));
  }

  // Check if bonus is still valid
  const now = new Date();
  if (bonus.startDate > now || (bonus.endDate && bonus.endDate < now)) {
    return next(new AppError('Bonus is not currently available', 400));
  }

  // For now, just return success - you'd implement the actual bonus claiming logic
  res.status(200).json({
    status: 'success',
    message: 'Bonus claimed successfully',
    data: {
      bonus: {
        id: bonus._id,
        name: bonus.name,
        type: bonus.type,
        amount: bonus.amount,
        percentage: bonus.percentage,
      },
    },
  });
});

// Get welcome bonuses
export const getWelcomeBonuses = catchAsync(async (req, res, next) => {
  const bonuses = await Bonus.find({
    type: 'welcome',
    isActive: true,
    startDate: { $lte: new Date() },
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: new Date() } }
    ]
  }).sort({ amount: -1 });

  res.status(200).json({
    status: 'success',
    results: bonuses.length,
    data: {
      bonuses,
    },
  });
});
