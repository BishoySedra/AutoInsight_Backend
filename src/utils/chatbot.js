import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { distance } from "fastest-levenshtein"; // Import fuzzy matching library



// GEMINI API START
// Ensure proper chat history structure with valid roles and format.
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

export const chatFn = async (userMessage, sessionId, imageData) => {
  try {
    // Check if the question exists in FAQ
    if (userMessage && !imageData) {
      const closestMatch = findClosestMatch(userMessage);
      if (closestMatch) return { text: faqData[closestMatch] };
    }

    const systemPrompt = `
    You are a customer support chatbot for an application called AutoInsight. Analyze both text ang images related to the following:
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
    //   const systemPrompt= `
    //   You are a support chatbot for AutoInsight. Analyze both text and images related to:
    //   - CSV data analysis
    //   - Generated charts/graphs
    //   - App screenshots
    //   - Error messages
    //   For non-app-related content, respond: "I specialize in AutoInsight data analysis."

    //   When analyzing images:
    //   1. Describe visual content
    //   2. Explain technical details
    //   3. Relate to AutoInsight features
    //   4. Keep responses under 300 words
    // `;
    if (!chats.has(sessionId)) {
      chats.set(sessionId, {
        // model: imageData ? 'gemini-pro-vision' : 'gemini-pro',
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
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', // or detect from input
          data: imageData
        }
      });
    }

    // Add text prompt
    if (userMessage) {
      parts.push({ text: `${systemPrompt}\n\nUser Query: ${userMessage}` });
    }

    // Generate response
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: parts
      }]
    });

    const response = result.response.text();

    // Update chat history
    session.history.push(
      { role: 'user', parts },
      { role: 'model', parts: [{ text: response }] }
    );

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
// GEMINI API END

