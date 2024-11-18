import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.vectorstock.com',
			},
			{
				protocol: 'https',
				hostname: 'cloud.appwrite.io',
			},
		],
	},
};

export default nextConfig;
