/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['upload.wikimedia.org', 'i.gyazo.com'],
	},
	swcMinify: true,
	compiler: {
		emotion: true,
	},
};

module.exports = nextConfig;
