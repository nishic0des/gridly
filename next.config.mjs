/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (isServer) {
			// Ensure Prisma Client is generated during build
			require("./prisma/generate-prisma");
		}
		return config;
	},
};

export default nextConfig;
