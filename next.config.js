/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@components': path.resolve(__dirname, 'src/components'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@types': path.resolve(__dirname, 'src/types'),
            '@styles': path.resolve(__dirname, 'src/styles')
        };
        return config;
    },
}

module.exports = nextConfig