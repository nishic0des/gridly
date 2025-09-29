/** @type {import('next').NextConfig} */
const nextConfig = {
	// Keep React StrictMode enabled (it's good for development)
	reactStrictMode: true,

	webpack: (config, { isServer }) => {
		if (isServer) {
			// Use dynamic import for ES modules
			import("./prisma/generate-prisma.mjs").catch(console.error);
		}
		return config;
	},
};

export default nextConfig;
