import "dotenv/config";

export const config = {
  port: parseInt(process.env.BACKEND_PORT || "") || 4000,
  frontendPort: parseInt(process.env.PORT || "") || 3000,
  url: process.env.URL || "http://localhost",
  isProduction: process.env.NODE_ENV === "production",
  prodDatabase: process.env.PROD_DATABASE,
  emailDomain: process.env.EMAIL_DOMAIN || "servesyncplus.et",
  fallbackServiceImage:
    process.env.FALLBACK_SERVICE_IMAGE ||
    "https://images.unsplash.com/photo-1658750691955-7ba9fbb96a17?w=800&auto=format",
};
