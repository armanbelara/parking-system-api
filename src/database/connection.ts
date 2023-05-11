import { connect } from "https://deno.land/x/cotton@v0.7.5/mod.ts";
import { HOST as DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } from "../config/config.ts";

export const connection = await connect({
	type: 'mysql',
	hostname: DB_HOST,
	port: DB_PORT,
	database: DB_NAME,
	username: DB_USER,
	password: DB_PASS
});

export const manager = connection.getManager();
