/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
    webpack: (config) => {
        // Add rule for SVG files
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
    experimental: {
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        }
    },
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'rantingmedia.com',
                port: '',
                pathname: '/wp-content/**',
            },
            {
                protocol: 'https',
                hostname: 'staticctf.ubisoft.com',
                port: '',
                pathname: '/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/drmatz1gd/**',
            },
        ],
    },
    logging: {
        fetches: {
            hmrRefreshes: true,
            fullUrl: true
        },
    },
};

const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

export default bundleAnalyzer(nextConfig)
