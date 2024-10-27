import { Router } from 'express';
import userRoutes from './userRoutes';
// import other routes

const router = Router();

router.use('/users', userRoutes);
// use other routes

export default router;