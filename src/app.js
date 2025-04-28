// =======================
// Load Environment Variables
// =======================
import dotenv from "dotenv";
dotenv.config();

// =======================
// Imports
// =======================
import express from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

// Routes
import authRouter from "./routes/auth.js";
import fileRouter from "./routes/file.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js";
import datasetRouter from "./routes/dataset.js";
import chatbotRouter from "./routes/chatbot.js";
import teamRouter from "./routes/team.js";
import notificationRouter from "./routes/notification.js";

// Error handlers
import errorHandler from "./middlewares/errors/errorHandler.js";
import notFoundHandler from "./middlewares/errors/notFoundHandler.js";

// =======================
// App Initialization
// =======================
const app = express();
const baseUrl = process.env.BASE_URL || "/api/v1";

// =======================
// Global Middlewares
// =======================

// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Core middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(xss());

// Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// =======================
// Routes
// =======================
app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/files`, fileRouter);
app.use(`${baseUrl}/reviews`, reviewRouter);
app.use(`${baseUrl}/users`, userRouter);
app.use(`${baseUrl}/datasets`, datasetRouter);
app.use(`${baseUrl}/chatbot`, chatbotRouter);
app.use(`${baseUrl}/teams`, teamRouter);
app.use(`${baseUrl}/notifications`, notificationRouter);

// =======================
// Error Handling
// =======================
app.use(errorHandler);
app.use(notFoundHandler);

// =======================
// Export App
// =======================
export default app;
