export const logger = {
  info: (message) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`),
  warn: (message) => console.log(`[WARN] ${new Date().toISOString()}: ${message}`),
  error: (message) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`)
};