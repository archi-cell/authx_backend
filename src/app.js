import express from "express";
import helmet from "helmet";

import prisma from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.js";

import limiter from "./middleware/rateLimiter.js";

const app = express();

// middleware to read JSON
app.use(express.json());

// security middlewares
app.use(helmet());
app.use("/api/auth", limiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// test DB connection
app.get("/test-db", async (req, res) => {
    try {
        await prisma.user.findMany();
        res.send("Database connected successfully");
    } catch (err) {
        res.status(500).send("Database connection failed");
    }
});

// test route
app.get("/", (req, res) => {
    res.send("AuthX API is running");
});

export default app;
