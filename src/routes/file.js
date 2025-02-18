import { Router } from 'express';
import uploadfile from '../middlewares/upload/file.js';
import { sendResponse } from '../utils/response.js';

const router = Router();

// route to upload a file
router.post('/upload', uploadfile, (req, res) => {
    sendResponse(res, { url: req.file_url }, 'Uploaded!', 200);
});

export default router;
