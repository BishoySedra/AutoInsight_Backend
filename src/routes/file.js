import { Router } from 'express';
import uploadfile from '../middlewares/upload/file.js';
import { sendResponse } from '../utils/response.js';

const router = Router();

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Uploaded!"
 *               body:
 *                 url: "https://example.com/uploaded-file.jpg"
 *               status: 200
 */
// route to upload a file
router.post('/upload', uploadfile, (req, res) => {
    sendResponse(res, { url: req.file_url }, 'Uploaded!', 200);
});

export default router;
