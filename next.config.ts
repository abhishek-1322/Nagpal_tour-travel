// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   // Keep links to the old website's pages working.
//   async redirects() {
//     return [
//       { source: "/pay-online", destination: "/pay", permanent: true },
//       { source: "/about-us", destination: "/about", permanent: true },
//       { source: "/book-now", destination: "/#book", permanent: true },
//       { source: "/term&conditions", destination: "/terms", permanent: true },
//     ];
//   },
// };

// export default nextConfig;




import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Allow access to Next.js development resources from your local network.
  allowedDevOrigins: ["192.168.1.18"],

  // Keep links to the old website's pages working.
  async redirects() {
    return [
      { source: "/pay-online", destination: "/pay", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/book-now", destination: "/#book", permanent: true },
      { source: "/term&conditions", destination: "/terms", permanent: true },
    ];
  },
};

export default nextConfig;
