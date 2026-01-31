import express from "express";
import prisma from "../config/db.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// PROTECTED PROFILE ROUTE
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
});

export default router;
