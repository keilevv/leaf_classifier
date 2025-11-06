import { Router } from "express";
import speciesController from "../controllers/species";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const controller = speciesController();
const { getSpecies, createSpecies } = controller;
router.get("/", authenticateToken, getSpecies);
router.post("/", authenticateToken, createSpecies);

export default router;
