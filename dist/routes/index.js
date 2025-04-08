import { Router } from 'express';
import { thoughtRoutes } from './thoughtRoutes.js';
import { userRoutes } from './userRoutes.js';
const router = Router();
router.use('/thoughts', thoughtRoutes);
router.use('/user', userRoutes);
export default router;
