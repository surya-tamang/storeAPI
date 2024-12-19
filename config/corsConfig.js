// config/corsConfig.js
const allowedOrigins = [
  "http://localhost:4000", // Frontend local development URL
  "https://surya-tamang.github.io/trendhop/", // GitHub Pages URL
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
