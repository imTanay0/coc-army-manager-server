import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";

// CONFIG
dotenv.config({ path: ".env" });
const app = express();

export const FRONTEND_URL = process.env.CORS_ORIGIN;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// MIDDLEWARES
app.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);

// app.use(upload.single());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// ROUTES
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => res.send(`Hello Users`));

export { app };