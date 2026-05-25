import "dotenv/config";

export const config = {
  port: parseInt(process.env.BACKEND_PORT || "") || 4000,
  frontendPort: parseInt(process.env.PORT || "") || 3000,
  url: process.env.URL || "http://localhost",
  isProduction: process.env.NODE_ENV === "production",
  prodDatabase:
    process.env.NODE_ENV === "production" || !!process.env.PROD_DATABASE,
  emailDomain: process.env.EMAIL_DOMAIN || "servesyncplus.et",
};
