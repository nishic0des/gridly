// prisma/generate-prisma.mjs
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Force generate Prisma Client
console.log("Generating Prisma Client...");
execSync("npx prisma generate --schema=./prisma/schema.prisma", {
	stdio: "inherit",
});
console.log("Prisma Client generated successfully");
