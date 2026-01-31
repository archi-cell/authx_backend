import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    getAllUsers,
    promoteUser,
    demoteUser
} from "../controllers/adminController.js";

const router = express.Router();

/**
 * ADMIN DASHBOARD
 * GET /api/admin/dashboard
 */

// GET all users
router.get(
    "/users",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllUsers
);

// Admin dashboard
router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("ADMIN"),
    (req, res) => {
        res.json({
            message: "Welcome Admin",
            adminId: req.user.userId,
        });
    }
);

/**
 * PROMOTE USER → ADMIN
 * PUT /api/admin/promote/:userId
 */
router.put(
    "/promote/:userId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    promoteUser
);

/**
 * DEMOTE ADMIN → USER
 * PUT /api/admin/demote/:userId
 */
router.put(
    "/demote/:userId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    demoteUser
);

export default router;
