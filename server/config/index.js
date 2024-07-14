import mongoose from "mongoose";
import firebase from "firebase-admin";

import { safeEnv } from "../utils/safeEnv.js";
import { timeLogger } from "../utils/timeLogger.js";

// Cors Config
/**
 * @type {import('cors').CorsOptions}
 */
export const corsOptions = {
  origin: safeEnv(process.env.FRONTEND_URL),
  credentials: true,
};

// Firebase Config
export function initFirebase() {
  firebase.initializeApp({
    credential: firebase.credential.cert(
      JSON.parse(safeEnv(process.env.FIREBASE_ADMIN_OPTIONS))
    ),
  });
}

// MongoDB Config
export async function connectToDb() {
  try {
    const conn = await mongoose.connect(safeEnv(process.env.MONGO_URI));
    timeLogger(`MongoDB Connected!! ${conn.connection.host}`);
  } catch (error) {
    timeLogger(`Failed to connect MongoDB: ${error.message}`);
    process.exit(-1);
  }
}
