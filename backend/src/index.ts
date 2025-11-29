import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./interface/middlewares/errorHanlder";
import { Logger } from "./shared/utils/logger";
import authRouter from "./interface/routes/auth.route";
import doctorRouter from "./interface/routes/doctor.route";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Swagger setup
const swaggerOptions = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clinic Management Dashboard API",
      version: "1.0.0",
      description: "API documentation for Clinic Management Dashboard",
      contact: {
        name: "Dilmi Abderrahmane",
        email: "abderrahmane.dilmi@ensia.edu.dz",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/interface/routes/*.ts"], // ✅ Point to route files
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// Sample route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// This mounts all auth routes at /auth prefix
app.use("/auth", authRouter);
// This mounts all doctor routes at /doctors prefix
app.use("/doctors", doctorRouter);
app.use(errorHandler);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  Logger.success(`Server is running on port ${PORT}`);
  Logger.success(
    `📚 Swagger UI available at http://localhost:${PORT}/api-docs`
  );
});
