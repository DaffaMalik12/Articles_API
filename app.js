require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const cors = require("cors");

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Define CORS options
const corsOptions = {
  origin: "*",
  methods: ["PUT", "GET", "HEAD", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  exposedHeaders: ["Authorization"],
  credentials: true,
};

// Apply CORS with options
app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/uploads", express.static("uploads"));

const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "none",
    showCommonExtensions: true,
    syntaxHighlight: {
      activate: true,
      theme: "night",
    },
  },
};

// Setup Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

app.use((req, res, next) => {
  if (req.originalUrl.includes("/api-docs")) {
    res.setHeader("Authorization", req.headers.authorization || "");
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
