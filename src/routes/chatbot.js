import { Router } from 'express';
import { chatFn } from '../utils/chatbot.js';
import upload from '../utils/multer.js';

const router = Router();
router.post("/", upload.single("image"), async (req, res) => {
  console.log(req.file);
  console.log(req.body);
  
   
  const userMessage = req.body.message; // Get user input from request body
  let botResponse;
  if(req.file)
  {
    botResponse = await chatFn(userMessage,"jaskldjas",req.file.path); // Get chatbot response
  }
  else{
    botResponse = await chatFn(userMessage,"jaskldjas"); // Get chatbot response
  }
  res.json({ response: botResponse }).status(200); // Send response back to client
});
export default router;