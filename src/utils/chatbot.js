import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { distance } from "fastest-levenshtein"; // Import fuzzy matching library

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chats = new Map();
const faqData = JSON.parse(fs.readFileSync("./src/utils/faq.json", "utf-8"));

const findClosestMatch = (userMessage) => {
  let bestMatch = null;
  let bestScore = Infinity; // Lower score = better match
  const cleanMessage = userMessage.toLowerCase().replace(/[^a-z0-9 ]/g, '');

  Object.keys(faqData).forEach((faqQuestion) => {
    const cleanFaq = faqQuestion.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const score = distance(cleanMessage, cleanFaq);
    if (score < bestScore && score < 5) {
      bestScore = score;
      bestMatch = faqQuestion;
    }
  });

  return bestMatch;
};

// Helper function to convert image to Base64
const encodeImageToBase64 = (imagePath) => {
  return fs.readFileSync(imagePath, { encoding: 'base64' });
};

export const chatFn = async (userMessage, sessionId, imageData) => {
  try {
    // Check if the question exists in FAQ
    if (userMessage && !imageData) {
      const closestMatch = findClosestMatch(userMessage);
      if (closestMatch) return { text: faqData[closestMatch] };
    }

    const systemPrompt = `
    You are a customer support chatbot for an application called AutoInsight. Analyze both text and images related to the following:
    - CSV data analysis
    - Generated charts/graphs
    - App screenshots
    - Error messages
    When analyzing images:
      1. Describe visual content
      2. Explain technical details
      3. Relate to AutoInsight features
      4. Keep responses under 300 words
    AutoInsight is a data analysis tool that allows users to upload CSV files and generate insights using charts and graphs.
    How to upload a csv file? Go to the homepage and click the 'Upload CSV' button. Select your CSV file and then press 'Analyze' to start the data processing.
    Once the analysis is complete, the system will generate insights and display them on your dashboard.
    How to view the results? After processing, your insights will appear on the dashboard as charts and tables.
    What type of files can I upload? Currently, AutoInsight supports CSV files only. Ensure your file has proper headers.
    Can I download the results? Yes! Click the 'Export' button to save the results as a CSV file or image.
    How long does the analysis take? Most analyses complete within a few seconds, depending on file size.
    Is my data stored permanently? No, AutoInsight processes your file temporarily and does not store your data.
    Can I analyze multiple files at once? Currently, AutoInsight supports one file at a time. Batch analysis will be available soon!
    `;
  
  if (!chats.has(sessionId)) {
    chats.set(sessionId, {
      model: 'gemini-1.5-flash',
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Ready to analyze AutoInsight data and visuals.' }] }
      ]
    });
  }
  const session = chats.get(sessionId);
  const model = genAI.getGenerativeModel({ model: session.model });
  const parts = [];

  // Add image if present
  if (imageData) {
    // Check if imageData is a file path or actual Base64 string
    let base64Image;
    if (imageData.startsWith('data:image')) {
      // It's already a Base64 string
      base64Image = imageData.split(',')[1];
    } else {
      // Convert image from file path to Base64
      base64Image = encodeImageToBase64(imageData);
    }

    parts.push({
      inlineData: {
        mimeType: 'image/jpeg', // Adjust mimeType based on the image type
        data: base64Image
      }
    });

    session.history.push({ role: 'user', parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64Image } }] });
  }

  // Add text prompt
  if (userMessage) {
    parts.push({ text: userMessage });

    // Store user message in history
    session.history.push({ role: 'user', parts: [{ text: userMessage }] });
  }

  const lastFewMessages = session.history.slice(-5);

  // Generate response
  const result = await model.generateContent({
    contents: lastFewMessages  // Pass entire chat history, including images
  });

  const response = result.response.text();

  // Update chat history
  session.history.push({ role: 'model', parts: [{ text: response }] });

  return { text: response };

  } catch (error) {
    console.error("Chat Error:", error);
    return { 
      text: imageData 
        ? "I couldn't analyze that image. Please describe the issue in text."
        : "I'm having trouble responding. Please try again."
    };
  }
};
