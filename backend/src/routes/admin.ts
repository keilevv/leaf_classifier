import { Router } from "express";
import admincontroller from "../controllers/admin";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const controller = admincontroller();
const {
  getAdminClassifications,
  getAdminUsers,
  getAdminClassification,
  updateAdminClassification,
} = controller;
router.get("/classifications", authenticateToken, getAdminClassifications);
router.get("/users", authenticateToken, getAdminUsers);
router.get("/classification/:id", authenticateToken, getAdminClassification);
router.put("/classification/:id", authenticateToken, updateAdminClassification);

export default router;
