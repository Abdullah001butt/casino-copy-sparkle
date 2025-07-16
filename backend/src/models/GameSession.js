import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: [true, "Game ID is required"],
    },

    // Session Timing
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
      default: Date.now,
    },
    endTime: Date,
    duration: {
      type: Number, // in seconds
      default: 0,
    },

    // Financial Summary
    totalBet: {
      type: Number,
      required: [true, "Total bet is required"],
      default: 0,
      min: [0, "Total bet cannot be negative"],
    },
    totalWin: {
      type: Number,
      required: [true, "Total win is required"],
      default: 0,
      min: [0, "Total win cannot be negative"],
    },
    netResult: {
      type: Number,
      default: 0, // totalWin - totalBet
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "USD",
    },

    // Game Statistics
    spins: {
      type: Number,
      default: 0,
      min: [0, "Spins cannot be negative"],
    },
    rounds: {
      type: Number,
      default: 0,
      min: [0, "Rounds cannot be negative"],
    },

    // Session Status
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned", "disconnected"],
      default: "active",
    },

    // Game-specific Data
    gameData: {
      // Slot-specific data
      slotData: {
        biggestWin: { type: Number, default: 0 },
        bonusRounds: { type: Number, default: 0 },
        freeSpins: { type: Number, default: 0 },
        multipliers: [Number],
        winningCombinations: [
          {
            symbols: [String],
            payline: Number,
            multiplier: Number,
            payout: Number,
            timestamp: { type: Date, default: Date.now },
          },
        ],
      },

      // Table game specific data
      tableData: {
        handsPlayed: { type: Number, default: 0 },
        handsWon: { type: Number, default: 0 },
        handsLost: { type: Number, default: 0 },
        handsPushed: { type: Number, default: 0 },
        biggestWin: { type: Number, default: 0 },
        biggestLoss: { type: Number, default: 0 },
        winStreak: { type: Number, default: 0 },
        lossStreak: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
        streakType: {
          type: String,
          enum: ["win", "loss", "none"],
          default: "none",
        },
      },
    },

    // Detailed Game History
    gameHistory: [
      {
        roundId: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        betAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        winAmount: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
        gameResult: mongoose.Schema.Types.Mixed, // Flexible for different game types
        rng: {
          seed: String,
          result: mongoose.Schema.Types.Mixed,
        },
      },
    ],

    // Bonus Information
    bonusesUsed: [
      {
        bonusId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Bonus",
        },
        amountUsed: Number,
        wageringContribution: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Technical Information
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet"],
      default: "desktop",
    },
    browser: String,
    ipAddress: String,
    userAgent: String,

    // Connection Quality
    connectionQuality: {
      disconnections: { type: Number, default: 0 },
      reconnections: { type: Number, default: 0 },
      averageLatency: Number, // in milliseconds
      dataTransferred: Number, // in bytes
    },

    // Session Metadata
    sessionToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    serverInstance: String,

    // Responsible Gambling Tracking
    responsibleGambling: {
      warningsShown: [
        {
          type: { type: String, enum: ["time", "loss", "spending"] },
          message: String,
          timestamp: { type: Date, default: Date.now },
          acknowledged: { type: Boolean, default: false },
        },
      ],
      limitsReached: [
        {
          limitType: { type: String, enum: ["time", "loss", "deposit"] },
          limitValue: Number,
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },

    // Performance Metrics
    performance: {
      averageRoundTime: Number, // in seconds
      fastestRound: Number,
      slowestRound: Number,
      totalActions: { type: Number, default: 0 },
      errorCount: { type: Number, default: 0 },
      errors: [
        {
          errorCode: String,
          errorMessage: String,
          timestamp: { type: Date, default: Date.now },
          resolved: { type: Boolean, default: false },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
gameSessionSchema.index({ userId: 1, createdAt: -1 });
gameSessionSchema.index({ gameId: 1, createdAt: -1 });
gameSessionSchema.index({ isActive: 1 });
gameSessionSchema.index({ status: 1 });
gameSessionSchema.index({ sessionToken: 1 });
gameSessionSchema.index({ startTime: 1, endTime: 1 });

// Compound indexes
gameSessionSchema.index({ userId: 1, gameId: 1, createdAt: -1 });
gameSessionSchema.index({ userId: 1, isActive: 1 });

// Virtual for session duration calculation
gameSessionSchema.virtual("sessionDuration").get(function () {
  if (this.endTime) {
    return Math.floor((this.endTime - this.startTime) / 1000); // in seconds
  }
  return Math.floor((Date.now() - this.startTime) / 1000);
});

// Virtual for win rate calculation
gameSessionSchema.virtual("winRate").get(function () {
  if (this.spins === 0 && this.rounds === 0) return 0;
  const totalRounds = this.spins || this.rounds || 0;
  if (totalRounds === 0) return 0;

  // Calculate based on game type
  if (this.gameData.tableData && this.gameData.tableData.handsPlayed > 0) {
    return (
      (this.gameData.tableData.handsWon / this.gameData.tableData.handsPlayed) *
      100
    );
  }

  // For slots, calculate based on winning rounds
  const winningRounds = this.gameHistory.filter(
    (round) => round.winAmount > 0
  ).length;
  return (winningRounds / totalRounds) * 100;
});

// Virtual for average bet calculation
gameSessionSchema.virtual("averageBet").get(function () {
  const totalRounds = this.spins || this.rounds || this.gameHistory.length;
  if (totalRounds === 0) return 0;
  return this.totalBet / totalRounds;
});

// Virtual for RTP calculation for this session
gameSessionSchema.virtual("sessionRTP").get(function () {
  if (this.totalBet === 0) return 0;
  return (this.totalWin / this.totalBet) * 100;
});

// Pre-save middleware to calculate derived fields
gameSessionSchema.pre("save", function (next) {
  // Calculate net result
  this.netResult = this.totalWin - this.totalBet;

  // Calculate duration if session is ending
  if (this.endTime && !this.duration) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }

  // Update status based on activity
  if (this.endTime && this.isActive) {
    this.isActive = false;
    if (this.status === "active") {
      this.status = "completed";
    }
  }

  next();
});

// Methods
gameSessionSchema.methods.endSession = function (reason = "completed") {
  this.endTime = new Date();
  this.isActive = false;
  this.status = reason;
  this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  return this.save();
};

gameSessionSchema.methods.addGameRound = function (roundData) {
  this.gameHistory.push(roundData);
  this.totalBet += roundData.betAmount;
  this.totalWin += roundData.winAmount;
  this.netResult = this.totalWin - this.totalBet;

  // Update counters based on game type
  if (roundData.gameType === "slot") {
    this.spins += 1;
  } else {
    this.rounds += 1;
  }

  return this.save();
};

gameSessionSchema.methods.addResponsibleGamblingWarning = function (
  warningType,
  message
) {
  this.responsibleGambling.warningsShown.push({
    type: warningType,
    message: message,
    timestamp: new Date(),
  });
  return this.save();
};

gameSessionSchema.methods.recordLimitReached = function (
  limitType,
  limitValue
) {
  this.responsibleGambling.limitsReached.push({
    limitType: limitType,
    limitValue: limitValue,
    timestamp: new Date(),
  });
  return this.save();
};

gameSessionSchema.methods.recordError = function (errorCode, errorMessage) {
  this.performance.errorCount += 1;
  this.performance.errors.push({
    errorCode: errorCode,
    errorMessage: errorMessage,
    timestamp: new Date(),
  });
  return this.save();
};

// Static methods
gameSessionSchema.statics.getActiveSessionsCount = function () {
  return this.countDocuments({ isActive: true });
};

gameSessionSchema.statics.getUserActiveSessions = function (userId) {
  return this.find({ userId: userId, isActive: true });
};

gameSessionSchema.statics.getGameStats = function (gameId, startDate, endDate) {
  const matchStage = { gameId: gameId };
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = startDate;
    if (endDate) matchStage.createdAt.$lte = endDate;
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalBet: { $sum: "$totalBet" },
        totalWin: { $sum: "$totalWin" },
        totalSpins: { $sum: "$spins" },
        averageSessionTime: { $avg: "$duration" },
        averageBet: { $avg: "$totalBet" },
      },
    },
  ]);
};

export default mongoose.model("GameSession", gameSessionSchema);
