import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import connectDB from "./DB/config.js";

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

const app = express();
const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";

(async () => {
    const connection = await connectDB();

    // ===== Sessions =====
    app.use(session({
        secret: process.env.SESSION_SECRET || "supersecret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            client: connection.getClient(), // ✅ Reuse same DB connection
            ttl: 14 * 24 * 60 * 60,
        }),
        cookie: {
            secure: isProd,
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        },
    }));

    // Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Middlewares
    app.use(express.json());
    app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    }));
    app.use(helmet());
    app.use(ExpressMongoSanitize());
    app.use(xss());

    if (!isProd) {
        app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
            next();
        });
    }

    // Swagger
    const port = process.env.PORT || 3000;
    const baseUrl = process.env.BASE_URL || "/api/v1";
    const appUrl = process.env.APP_URL || "localhost";
    const protocol = process.env.PROTOCOL || "http";

    const swaggerOptions = {
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: "AutoInsight API",
                version: "1.0.0",
                description: "API documentation for AutoInsight Backend",
            },
            servers: [
                {
                    url: isProd
                        ? `${protocol}://${appUrl}${baseUrl}`
                        : `${protocol}://localhost:${port}${baseUrl}`,
                    description: isProd ? "Production server" : "Development server",
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
            security: [{ bearerAuth: [] }],
        },
        apis: ["./src/routes/*.js"],
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // Routes
    app.use(`${baseUrl}/auth`, authRouter);
    app.use(`${baseUrl}/files`, fileRouter);
    app.use(`${baseUrl}/reviews`, reviewRouter);
    app.use(`${baseUrl}/users`, userRouter);
    app.use(`${baseUrl}/datasets`, datasetRouter);
    app.use(`${baseUrl}/chatbot`, chatbotRouter);
    app.use(`${baseUrl}/teams`, teamRouter);
    app.use(`${baseUrl}/notifications`, notificationRouter);

    // Error handlers
    app.use(errorHandler);
    app.use(notFoundHandler);
})();

export default app;
