/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "res.cloudinary.com",
      "cdn.dribbble.com",
      "upload.wikMedia.org",
      "bubbleplan.net",
      "encrypted-tbn0.gstatic.com",
      "cdn-icons-png.flaticon.com",
      "100k-faces.glitch.me",
      "images.unsplash.com",
      "us.123rf.com",
      "www.w3schools.com",
      "apprendre-la-photo.fr",
    ],
  },
  swcMinify: true,
};

module.exports = nextConfig;
