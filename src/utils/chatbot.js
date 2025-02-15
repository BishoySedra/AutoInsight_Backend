import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { distance } from "fastest-levenshtein"; // Import fuzzy matching library



// GEMINI API START
// Ensure proper chat history structure with valid roles and format.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chats = new Map();

const faqData = JSON.parse(fs.readFileSync("./src/utils/faq.json", "utf-8"));
let chatHistory = [
  {
    role: "user",
    parts: [{ text: "What is AutoInsight?" }]
  },
  {
    role: "model", // Use "model" for AI responses.
    parts: [
      { text: "AutoInsight is a smart data analysis tool that allows users to upload CSV files, process them, and generate meaningful insights." },
      { text: "It creates charts, statistics, and visual reports to help users understand their data better." }
    ]
  },
  {
    role: "user",
    parts: [{ text: "How do I upload a file?" }]
  },
  {
    role: "model",
    parts: [
      { text: "To upload a file, go to the homepage and click the 'Upload CSV' button." },
      { text: "Select your CSV file and then press 'Analyze' to start the data processing." },
      { text: "Once the analysis is complete, the system will generate insights and display them on your dashboard." }
    ]
  }
];

const findClosestMatch = (userMessage) => {
  let bestMatch = null;
  let bestScore = Infinity; // Lower score = better match

  Object.keys(faqData).forEach((faqQuestion) => {
    const score = distance(userMessage.toLowerCase(), faqQuestion.toLowerCase());
    if (score < bestScore) {
      bestScore = score;
      bestMatch = faqQuestion;
    }
  });

  return bestScore < 5 ? bestMatch : null; // Only return if it's a close match
};

export const chatFn = async (userMessage, sessionId) => {
  try {
    // Check if the question exists in FAQ
    const closestMatch = findClosestMatch(userMessage);
    if (closestMatch) {
      return { text: String(faqData[closestMatch]) }; // Always return a JSON object
    }

    const systemPrompt = `
    You are a customer support chatbot for an app called AutoInsight. 
    Your role is to answer questions ONLY about the app's features and troubleshooting. 
    If asked about unrelated topics, politely decline.
    Regarding the application it is called AutoInsight and it is a data analysis tool that allows users to upload CSV files and generate insights using charts and graphs.
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
        chats.set(sessionId, model.startChat({
          history: [
            { role: 'user', parts: [{ text: systemPrompt }] }, // Inject system prompt
            { role: 'model', parts: [{ text: 'Understood. I will focus on answering questions about AutoInsights.' }] },
          ],
        }));
      }

    // Merge system and user prompts
    // const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}`;
    // const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    // const result = await model.generateContent(fullPrompt);
    // const text = result.response.text();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = chats.get(sessionId);
    const result = await chat.sendMessage(message);
    const response = await result.response.text();
    
    res.json({ reply: response });


    return { text };

  } catch (error) {
    console.error("Chatbot Error:", error);
    return { text: "I'm sorry, something went wrong. Please try again later." };
  }
};
// GEMINI API END

