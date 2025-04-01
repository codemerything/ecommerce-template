import { config } from "dotenv";

config();

export const {
  PORT,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  MONGO_URI,
  UPSTASH_REDIS_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  PAYSTACK_SECRET_KEY,
} = process.env;
