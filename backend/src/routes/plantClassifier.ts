import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import controller from "../controllers/plantClassifier";
import bodyParser from "body-parser";
import { authenticateToken } from "../middleware/auth";

const { uploadImage, getClassifications, updateClassification } = controller();

const router = express.Router();

const upload = multer({ dest: "./uploads" });

router.post("/upload", bodyParser.json(), upload.single("image"), uploadImage);
router.get("/classifications", authenticateToken, getClassifications);
router.patch("/classifications/:id", authenticateToken, updateClassification);

export default router;
