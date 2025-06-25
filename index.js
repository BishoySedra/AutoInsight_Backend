import app from "./src/app.js";
import connectDB from "./src/DB/config.js";

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    const baseUrl = process.env.BASE_URL || '/api/v1';
    const app_url = process.env.APP_URL || `localhost`;
    const protocol = process.env.PROTOCOL || 'http';
    const nodeEnv = process.env.NODE_ENV || 'development';
    app.listen(PORT, () => {
      if (nodeEnv !== 'production') {
        console.log(`🚀 Server is running in development mode at ${protocol}://localhost:${PORT}${baseUrl}`);
        console.log(`Swagger is available at ${protocol}://localhost:${PORT}/docs`);
      } else {
        console.log(`🚀 Server is running in production mode at ${protocol}://${app_url}${baseUrl}`);
        console.log(`Swagger is available at ${protocol}://${app_url}/docs`);
      }
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
