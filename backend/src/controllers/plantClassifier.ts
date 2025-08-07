import prisma from "../lib/prisma";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import axios from "axios";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

function plantClassifierController() {
  // These now return middleware functions that Express can use

  const uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const image = req.file;

      if (!image) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      // Save image to uploads folder
      const uploadPath = path.join(
        process.cwd(),
        "uploads",
        image.originalname
      );
      fs.renameSync(image.path, uploadPath);

      // Send image to classifier API
      const formData = new FormData();
      formData.append("image", fs.createReadStream(uploadPath));
      console.log("formData", formData.get("image"));
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );

      const { classification, confidence } = response.data;
      console.log("Classification result:", classification, confidence);

      // Create classification entry in DB
      const classificationEntry = await prisma.classification.create({
        data: {
          originalFilename: image.originalname,
          imagePath: `uploads/${image.originalname}`, // or absolute path if needed
          classification,
          confidence,
          userId,
        },
      });

      res.json(classificationEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  return {
    uploadImage,
  };
}

export default plantClassifierController;
