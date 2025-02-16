import { Router } from 'express';
import { chatFn } from '../utils/chatbot.js';

const router = Router();
router.post("/", async (req, res) => {
  const userMessage = req.body.message; // Get user input from request body
  const botResponse = await chatFn(userMessage); // Get chatbot response
  res.json({ response: botResponse }).status(200); // Send response back to client
});
export default router;