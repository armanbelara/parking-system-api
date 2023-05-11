import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();
const HOST = env.HOST;
const PORT = parseInt(env.PORT);
const DB_NAME = env.DB_NAME;
const DB_USER = env.DB_USER;
const DB_PASS = env.DB_PASS;
const DB_PORT = parseInt(env.DB_PORT);

export {
    HOST,
    PORT,
    DB_NAME,
    DB_USER,
    DB_PASS,
    DB_PORT
}