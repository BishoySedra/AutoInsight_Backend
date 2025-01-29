import { Router } from 'express';
import * as uploadController from '../controllers/file.js';

const router = Router();

// route to upload a file
router.post('/upload', uploadController.uploadFile);

export default router;