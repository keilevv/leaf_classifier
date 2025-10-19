import { Router } from "express";
import admincontroller from "../controllers/admin";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const controller = admincontroller();
const { getAdminClassifications } = controller;
router.get("/classifications", authenticateToken, getAdminClassifications);

export default router;
