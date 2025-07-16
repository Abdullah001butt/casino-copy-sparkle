import express from 'express';
import postRoutes from './postRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

// Admin routes
router.use('/posts', postRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
