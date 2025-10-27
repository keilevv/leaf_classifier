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
  getAdminUser,
} = controller;
router.get("/classifications", authenticateToken, getAdminClassifications);
router.get("/users", authenticateToken, getAdminUsers);
router.get("/classification/:id", authenticateToken, getAdminClassification);
router.put("/classification/:id", authenticateToken, updateAdminClassification);
router.get("/user/:id", authenticateToken, getAdminUser);

export default router;
