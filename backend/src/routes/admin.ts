import { Router } from "express";
import admincontroller from "../controllers/admin";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const controller = admincontroller();
const { getAdminClassifications, getAdminUsers } = controller;
router.get("/classifications", authenticateToken, getAdminClassifications);
router.get("/users", authenticateToken, getAdminUsers);

export default router;
