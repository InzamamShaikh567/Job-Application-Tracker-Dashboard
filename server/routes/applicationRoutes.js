import express from 'express';
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getStats,
  uploadApplicationResume,
  uploadCoverLetter,
  downloadFile,
  deleteFile,
} from '../controller/applicationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  uploadResume as uploadResumeMiddleware,
  uploadCoverLetter as uploadCoverLetterMiddleware,
} from '../utils/multer.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', getStats);

router.route('/').get(getApplications).post(createApplication);

router
  .route('/:id/resume')
  .post(uploadResumeMiddleware, uploadApplicationResume)
  .delete(deleteFile);

router
  .route('/:id/cover-letter')
  .post(uploadCoverLetterMiddleware, uploadCoverLetter)
  .delete(deleteFile);

router.route('/files/:type/:filename').get(downloadFile).delete(deleteFile);

router
  .route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;
