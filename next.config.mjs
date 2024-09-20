/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		staleTimes: {
			dynamic: 30,
		}
	},
	serverExternalPackages: ["@node-rs/argon2"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "utfs.io",
				pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com', // Google domain for avatar URLs
				pathname: '/**',
			}

		],
		domains: ['lh3.googleusercontent']


	}
};

export default nextConfig;
