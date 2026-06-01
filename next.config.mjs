/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["https://exam-pro-h1lx.onrender.com/api"],
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
