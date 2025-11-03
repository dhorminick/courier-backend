import express, { type Express, type Request, type Response } from "express";
import { config } from "./config/env.js";
import RootRoute from "./routes/index.js";
import mongoose from "mongoose";
import cors, { type CorsOptions } from "cors";

// #openapi
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import http from "http";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    console.log("origin: ", origin);
    if (!origin) {
      return callback(null, true);
    }

    if (
      origin.startsWith("http://localhost") ||
      origin === config.frontend_url ||
      origin === config.frontend_url_dev
    ) {
      return callback(null, true);
    }

    return callback(new Error("CORSUnauthorized"));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api", RootRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.message === "CORSUnauthorized") {
      return res.status(401).json({ status: "Unauthorized" });
    }

    next(err);

    console.error("Unhandled error:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }
);

// #openapi
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const startServer = async () => {
  try {
    mongoose
      .connect(config.mongoUri)
      .then(() => {
        console.log("Connected to MongoDB");
        app.listen(config.port, () => {
          console.log(`Server Listening port: ${config.port}`);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

// Start the application
startServer();
