import { Router } from 'express';
import uploadfile from '../middlewares/upload/file.js';
import { sendResponse } from '../utils/response.js';
import { SendUrlToPython } from '../controllers/file.js';

const router = Router();

// route to upload a file
router.post('/upload', uploadfile, (req, res) => {
    sendResponse(res, { url: req.file_url }, 'Uploaded!', 200);
});

router.post('/test-analysis', SendUrlToPython);

export default router;
