// Config file for better organization (separate module in practice)
export const config = {
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  email: {
      service: process.env.EMAIL_SERVICE || 'gmail',
      username: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD
  },
  security: {
      tokenExpiry: parseInt(process.env.TOKEN_EXPIRY_MS) || 3600000, // 1 hour in milliseconds
      passwordMinLength: 8
  }
};