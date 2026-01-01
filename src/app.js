import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Create an Express app
const app = express();

// Enable CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Middleware for handling JSON requests
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files (if any)
app.use(express.static("public"));

// Cookie parser
app.use(cookieParser());

// Swagger definition and setup
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Project Management API",
    version: "1.0.0",
    description: "API documentation for the Project Management System.",
  },
  servers: [
    {
      url: "http://13.201.9.134:5000" || "http://localhost:8000", 
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.js", "./dist/routes/**/*.js"], // Support both src and dist
};

const swaggerSpec = swaggerJsdoc(options);

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import route files
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

// Define routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Define a route for the root path
app.get("/", (req, res) => {
    res.send("Welcome to the Project Management API. Visit /api-docs for documentation.");
});

// Start the app
export default app;
