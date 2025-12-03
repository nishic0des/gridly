import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

// Validate required environment variables
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined in environment variables");
}

// Create a single PrismaClient instance and cache it during development
const globalForPrisma = globalThis;

// Configure the adapter with the connection string
const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

// Initialize Prisma Client with the adapter
const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		adapter,
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

// Store in globalThis in development only to prevent hot-reloading issues
if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
