import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  loginUser,
  registerUser,
  changePassword,
  deleteAvatar,
  deleteResume,
  downloadResume,
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
  getAvatar,
  getResume,
} from '../controller/authController.js';

import {
  uploadAvatar as uploadAvatarMiddleware,
  uploadResume as uploadResumeMiddleware,
} from '../utils/multer.js';

const router = express.Router();

// Public routes (NO authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (authentication required)
router.use(authMiddleware);

router.route('/profile').get(getProfile).put(updateProfile);

router
  .route('/avatar')
  .post(uploadAvatarMiddleware, uploadAvatar)
  .delete(deleteAvatar);

router.route('/avatar-display').get(getAvatar);

router
  .route('/resume')
  .post(uploadResumeMiddleware, uploadResume)
  .delete(deleteResume);

router.route('/resume/:filename').get(downloadResume);

router.route('/resume-download').get(getResume);
router.route('/change-password').put(changePassword);

export default router;
