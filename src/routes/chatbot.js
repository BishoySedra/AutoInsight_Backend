import { Router } from 'express';
import { chatFn } from '../utils/chatbot.js';
import upload from '../utils/multer.js';

const router = Router();

/**
 * @swagger
 * /chatbot:
 *   post:
 *     summary: Interact with the chatbot
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "What is the weather today?"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file for chatbot interaction
 *     responses:
 *       200:
 *         description: Successfully interacted with chatbot
 *         content:
 *           application/json:
 *             example:
 *               message: "Chatbot response generated successfully"
 *               body:
 *                 response: "The weather today is sunny with a high of 25°C."
 *               status: 200
 */
router.post("/", upload.single("image"), async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  const userMessage = req.body.message; // Get user input from request body
  let botResponse;
  if (req.file) {
    botResponse = await chatFn(userMessage, "jaskldjas", req.file.path); // Get chatbot response
  } else {
    botResponse = await chatFn(userMessage, "jaskldjas"); // Get chatbot response
  }
  res.json({ message: "Chatbot response generated successfully", body: { response: botResponse }, status: 200 });
});

export default router;