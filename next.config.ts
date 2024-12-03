import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		serverActions: {
			bodySizeLimit: '100mb',
		},
	},
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
			{
				protocol: 'https',
				hostname: 'cdn3d.iconscout.com',
			},
		],
	},
};

export default nextConfig;
