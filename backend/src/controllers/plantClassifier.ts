import prisma from "../lib/prisma";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";

// Extend the Request interface to include user and file properties
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
  file?: any; // Multer file object
}

const classifierServiceUrl =
  process.env.CLASSIFY_SERVICE_URL || "http://localhost:5000/api";

function plantClassifierController() {
  // These now return middleware functions that Express can use

  const uploadImage = async (
    req: AuthenticatedRequest,
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

      if (fs.existsSync(uploadPath)) {
        const formData = new FormData();
        formData.append(
          "image",
          fs.createReadStream(uploadPath),
          image.originalname
        );

        console.log("Sending image to classifier service...");

        const response = await axios.post(
          `${classifierServiceUrl}/upload`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          }
        );

        const { classification, confidence } = response.data;

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
        res.status(200).json({
          message: "Image uploaded and classified successfully",
          classification: classificationEntry,
        });
      } else {
        console.error(`File not found at ${uploadPath}`);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  async function getClassifications(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const [classifications, count] = await Promise.all([
        prisma.classification.findMany({
          where: { userId: req.user.id },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.classification.count({ where: { userId: req.user.id } }),
      ]);

      const totalPages = Math.ceil(count / limit);

      const response = {
        count,
        pages: totalPages,
        results: classifications,
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching classifications:", error);
      res.status(500).json({ error: "Failed to fetch classifications" });
    }
  }

  return {
    uploadImage,
    getClassifications,
  };
}

export default plantClassifierController;
