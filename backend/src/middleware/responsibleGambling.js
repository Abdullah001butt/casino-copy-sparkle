import { AppError } from "./errorHandler";

// Check deposit limits
export const checkDepositLimits = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const user = req.user;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get user's deposits for different periods
    const dailyDeposits = await getDepositsSum(user._id, today);
    const weeklyDeposits = await getDepositsSum(user._id, thisWeek);
    const monthlyDeposits = await getDepositsSum(user._id, thisMonth);

    // Check limits
    if (dailyDeposits + amount > user.limits.dailyDeposit) {
      return res.status(400).json({
        status: 'error',
        message: `Daily deposit limit of $${user.limits.dailyDeposit} would be exceeded`,
        currentDaily: dailyDeposits,
        limit: user.limits.dailyDeposit,
      });
    }

    if (weeklyDeposits + amount > user.limits.weeklyDeposit) {
      return res.status(400).json({
        status: 'error',
        message: `Weekly deposit limit of $${user.limits.weeklyDeposit} would be exceeded`,
        currentWeekly: weeklyDeposits,
        limit: user.limits.weeklyDeposit,
      });
    }

    if (monthlyDeposits + amount > user.limits.monthlyDeposit) {
      return res.status(400).json({
        status: 'error',
        message: `Monthly deposit limit of $${user.limits.monthlyDeposit} would be exceeded`,
        currentMonthly: monthlyDeposits,
        limit: user.limits.monthlyDeposit,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Check session time limits
export const checkSessionTime = (req, res, next) => {
  const user = req.user;
  const sessionStart = req.session?.startTime || new Date();
  const sessionDuration = (Date.now() - sessionStart.getTime()) / (1000 * 60); // minutes

  if (sessionDuration > user.limits.sessionTime) {
    return res.status(400).json({
      status: 'error',
      message: `Session time limit of ${user.limits.sessionTime} minutes exceeded`,
      sessionDuration: Math.floor(sessionDuration),
      limit: user.limits.sessionTime,
    });
  }

  next();
};

// Helper function to get deposits sum
async function getDepositsSum(userId, fromDate) {
  // This would query your transactions/deposits collection
  // For now, returning 0 - implement when you create the Transaction model
  return 0;
}
