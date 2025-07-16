import express from 'express';
import {
  getAllGames,
  getGame,
  getPopularGames,
  getFeaturedGames,
  getGamesByCategory,
} from '../controllers/gameController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', optionalAuth, getAllGames);
router.get('/popular', getPopularGames);
router.get('/featured', getFeaturedGames);
router.get('/category/:category', getGamesByCategory);
router.get('/:id', optionalAuth, getGame);

export default router;
