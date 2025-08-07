import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import controller from "../controllers/plantClassifier";
import bodyParser from "body-parser";

const { uploadImage } = controller();

const router = express.Router();

const upload = multer({ dest: "./uploads" });

router.post("/upload", bodyParser.json(), upload.single("image"), uploadImage);

export default router;
