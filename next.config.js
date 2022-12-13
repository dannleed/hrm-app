/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['upload.wikimedia.org', 'drive.google.com'],
	},
	swcMinify: true,
	compiler: {
		emotion: true,
	},
};

module.exports = nextConfig;
