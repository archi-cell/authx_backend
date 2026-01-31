import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

/**
 * ISSUE TOKENS (used after login)
 */
export const issueTokens = async (user, res) => {
    const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    // save refresh token in DB
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    res.json({
        accessToken,
        refreshToken,
    });
};

/**
 * GET ALL USERS (ADMIN)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

/**
 * PROMOTE USER → ADMIN
 */
export const promoteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role: "ADMIN" },
        });

        res.json({
            message: "User promoted to ADMIN",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to promote user",
        });
    }
};

/**
 * DEMOTE ADMIN → USER
 */
export const demoteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role: "USER" },
        });

        res.json({
            message: "Admin demoted to USER",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to demote user",
        });
    }
};

/**
 * REFRESH ACCESS TOKEN
 */
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    let payload;
    try {
        payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    } catch {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
};

/**
 * LOGOUT
 */
export const logout = async (req, res) => {
    await prisma.user.update({
        where: { id: req.user.userId },
        data: { refreshToken: null },
    });

    res.json({ message: "Logged out successfully" });
};
