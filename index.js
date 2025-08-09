import app from "./src/app.js";
import connectDB from "./src/DB/config.js";

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    const baseUrl = process.env.BASE_URL || "/api/v1";
    const appUrl = process.env.APP_URL || "localhost";
    const protocol = process.env.PROTOCOL || "http";
    const nodeEnv = process.env.NODE_ENV || "development";
    const isProd = nodeEnv === "production";

    app.listen(PORT, () => {
      console.log(`🚀 Server is running in ${nodeEnv} mode at ${protocol}://${isProd ? appUrl : `localhost:${PORT}`}${baseUrl}`);
      console.log(`📄 Swagger is available at ${protocol}://${isProd ? appUrl : `localhost:${PORT}`}/docs`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
