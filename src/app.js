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
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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
// Swagger Configuration
// =======================
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || "/api/v1";
const appUrl = process.env.APP_URL || `localhost`;
const protocol = process.env.PROTOCOL || "http";
let swaggerOptions = {};
if (process.env.NODE_ENV !== "production") {
    console.log("Swagger is enabled in development mode");
    swaggerOptions = {
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: "AutoInsight API",
                version: "1.0.0",
                description: "API documentation for AutoInsight Backend",
            },
            servers: [
                {
                    url: `${protocol}://localhost:${port}${baseUrl}`, // Use the base URL from environment variables
                    description: "Development server",
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
        },
        apis: ["./src/routes/*.js"], // Path to the route files
    };
} else {
    console.log("Swagger is enabled in production mode");
    const app_url = process.env.APP_URL;
    swaggerOptions = {
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: "AutoInsight API",
                version: "1.0.0",
                description: "API documentation for AutoInsight Backend",
            },
            servers: [
                {
                    url: `${protocol}://${app_url}${baseUrl}`, // Use the base URL from environment variables
                    description: "Production server",
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
        },
        apis: ["./src/routes/*.js"], // Path to the route files
    };
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
