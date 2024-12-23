// config/corsConfig.js
const allowedOrigins = [
  "http://localhost:4000", // Frontend local development URL
  "http://192.168.18.3:4000", //hosting url
  "https://surya-tamang.github.io", // GitHub Pages URL
];

export const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); // Allow the origin
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the origin
    }
  },
  credentials: true, // Allow cookies or authorization headers
};
