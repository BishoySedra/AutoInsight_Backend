import app from "./src/app.js";

const PORT = process.env.PORT || 5000;
const baseUrl = process.env.BASE_URL || "/api/v1";
const appUrl = process.env.APP_URL || "localhost";
const protocol = process.env.PROTOCOL || "http";
const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";

app.listen(PORT, () => {
  console.log(`🚀 Server is running in ${nodeEnv} mode at ${protocol}://${isProd ? appUrl : `localhost:${PORT}`}${baseUrl}`);
  console.log(`📄 Swagger is available at ${protocol}://${isProd ? appUrl : `localhost:${PORT}`}/docs`);
  console.log(`🔗 API Base URL: ${protocol}://${isProd ? appUrl : `localhost:${PORT}`}${baseUrl}`);
  console.log(`🔧 Environment: ${nodeEnv}`);
});
