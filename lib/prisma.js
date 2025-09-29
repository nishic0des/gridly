import { PrismaClient } from "@prisma/client";

// Prevent multiple instances in development
const globalForPrisma = globalThis;

// Check if we need to create a new PrismaClient
const prisma =
	globalForPrisma.prisma ||
	(() => {
		console.log("Creating new Prisma Client");
		return new PrismaClient({
			log:
				process.env.NODE_ENV === "development"
					? ["query", "error", "warn"]
					: ["error"],
		});
	})();

// Store in globalThis in development only
if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
