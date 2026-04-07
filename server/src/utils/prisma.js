import { PrismaClient } from "../generated/client/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

// Database URL from environment for consistency with Prisma CLI
const adapter = new PrismaBetterSqlite3({ 
  url: process.env.DATABASE_URL || "file:./dev.db" 
});
const prisma = new PrismaClient({ adapter });

export default prisma;
