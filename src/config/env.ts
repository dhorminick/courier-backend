import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET || "",
  frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
  frontend_url_dev:
    process.env.FRONTEND_URL_DEV ||
    "https://booking-frontend-dycovues-projects.vercel.app",
};
