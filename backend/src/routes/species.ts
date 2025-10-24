import { Router } from "express";
import speciesController from "../controllers/species";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const controller = speciesController();
const { getSpecies } = controller;
router.get("/", authenticateToken, getSpecies);

export default router;
