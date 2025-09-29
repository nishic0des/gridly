/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Disable the Edge runtime for API routes
	experimental: {
		serverComponentsExternalPackages: ["@prisma/client"],
	},
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = [
				...(config.externals || []),
				{ "@prisma/client": "commonjs @prisma/client" },
			];
		}
		return config;
	},
};

export default nextConfig;
