import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
    promoteUser,
    demoteUser
} from "../controllers/adminController.js";

const router = express.Router();

// Promote user → ADMIN
router.put(
    "/promote/:userId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    promoteUser
);

// Demote admin → USER
router.put(
    "/demote/:userId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    demoteUser
);

export default router;
