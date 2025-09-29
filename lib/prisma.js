import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

// Only in development, store the Prisma Client in globalThis
if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

// Optional: Log Prisma Client initialization
if (process.env.NODE_ENV === "development") {
	console.log("Prisma Client initialized");
}

export default prisma;
