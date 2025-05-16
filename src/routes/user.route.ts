import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', UserController.login);
router.post('/signup', UserController.signup);
router.get('/getProfile', authenticate, UserController.getProfile);
router.put('/updateProfile', authenticate, UserController.updateProfile);

export default router;