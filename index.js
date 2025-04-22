import express from "express";
import dotenv from "dotenv";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import helmet from "helmet";
import cors from "cors";
import session from 'express-session';

// import csurf from "csurf";
import connectDB from "./src/DB/config.js";
import authRouter from "./src/routes/auth.js";
import fileRouter from "./src/routes/file.js";
import reviewRouter from "./src/routes/review.js";
import userRouter from "./src/routes/user.js";
import datasetRouter from "./src/routes/dataset.js";
import chatbotRouter from "./src/routes/chatbot.js";
import teamRouter from "./src/routes/team.js";

// import csurf from "csurf";
import connectDB from "./src/DB/config.js";
import errorHandler from "./src/middlewares/errors/errorHandler.js";
import notFoundHandler from "./src/middlewares/errors/notFoundHandler.js";

// Load environment variables from .env file
dotenv.config();

// Create a new express application
const app = express();

// Enable CORS for all requests (for now)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// The request handler must be the first middleware on the app
app.use(express.json());

// Enable sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Set logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Set security HTTP headers
app.use(helmet());

// Enable CSRF protection
// app.use(csurf({ cookie: true }));

// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

// Data sanitization against XSS
app.use(xss());

const baseUrl = process.env.BASE_URL;
// Define a route handler for the default home page
app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/files`, fileRouter);
app.use(`${baseUrl}/reviews`, reviewRouter);
app.use(`${baseUrl}/users`, userRouter);
app.use(`${baseUrl}/datasets`, datasetRouter);
app.use(`${baseUrl}/chatbot`, chatbotRouter);
app.use(`${baseUrl}/teams`, teamRouter);

app.use(errorHandler);
app.use(notFoundHandler);

// Start the Express server
try {
  app.listen(process.env.PORT, async () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
  });
  await connectDB();
} catch (error) {
  console.error("Error starting server: ", error);
}
