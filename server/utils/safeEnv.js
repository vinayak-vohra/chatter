import { config } from "dotenv";

config();

export function safeEnv(enVar) {
  if (!enVar) throw new Error("Env variable not found!!");
  return enVar;
}
