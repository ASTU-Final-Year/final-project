import { config } from "~/config";
import pgSchema from "./pg";
import sqliteSchema from "./sqlite";

export const users = config.isProduction ? pgSchema.users : sqliteSchema.users;

export const sessions = config.isProduction
  ? pgSchema.sessions
  : sqliteSchema.sessions;
