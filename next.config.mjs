/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (isServer) {
			// Ensure Prisma Client is generated during build
			import("./prisma/generate-prisma.mjs");
		}
		return config;
	},
};

export default nextConfig;
