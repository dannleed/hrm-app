/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['upload.wikimedia.org'],
	},
	swcMinify: true,
	compiler: {
		emotion: true,
	},
};

module.exports = nextConfig;
