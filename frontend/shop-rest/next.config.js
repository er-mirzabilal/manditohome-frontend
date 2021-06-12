const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
    runtimeCaching,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/grocery",
        permanent: false,
      },
    ];
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "s3.amazonaws.com",
      "18.141.64.26",
      "via.placeholder.com",
      "pickbazarlaravel.s3.ap-southeast-1.amazonaws.com",
      "picsum.photos",
        "localhost"
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
