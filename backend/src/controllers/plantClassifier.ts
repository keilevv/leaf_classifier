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
  process.env.CLASSIFY_SERVICE_URL || "http://localhost:8000/api";

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
        // Send image to classification service
        axios
          .post(`${classifierServiceUrl}/upload`, formData, {
            headers: {
              ...formData.getHeaders(),
            },
          })
          .then(async (response) => {
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
            return res.status(200).json({
              message: "Image uploaded and classified successfully",
              classification: classificationEntry,
            });
          })
          .catch((error) => {
            return res.status(500).json({
              error: error.message,
              message: "Error classifying image",
            });
          });
      } else {
        return res
          .status(404)
          .json({ error: `File not found at ${uploadPath}` });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
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

      // Build Prisma where filter
      const where: any = {};

      // Only allow admin to filter by userId, otherwise restrict to own
      if (req.user.role === "admin" && req.query.userId) {
        where.userId = req.query.userId;
      } else {
        where.userId = req.user.id;
      }

      // Filter by isArchived, default to false if not provided
      if (typeof req.query.isArchived !== "undefined") {
        if (req.query.isArchived === "true") where.isArchived = true;
        else if (req.query.isArchived === "false") where.isArchived = false;
      } else {
        where.isArchived = false;
      }

      // Filter by classification (exact match)
      if (req.query.classification) {
        where.classification = req.query.classification;
      }

      // Filter by originalFilename (partial match)
      if (req.query.originalFilename) {
        where.originalFilename = {
          contains: req.query.originalFilename as string,
          mode: "insensitive",
        };
      }

      // Date filters
      if (req.query.createdAt_gte || req.query.createdAt_lte) {
        where.createdAt = {};
        if (req.query.createdAt_gte) {
          where.createdAt.gte = new Date(req.query.createdAt_gte as string);
        }
        if (req.query.createdAt_lte) {
          where.createdAt.lte = new Date(req.query.createdAt_lte as string);
        }
      }

      // Add more filters as needed...

      const [classifications, count] = await Promise.all([
        prisma.classification.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.classification.count({ where }),
      ]);

      const totalPages = Math.ceil(count / limit);

      const response = {
        count,
        pages: totalPages,
        results: classifications,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch classifications" });
    }
  }

  async function updateClassification(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { isArchived, classification } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Fetch the classification
      const existing = await prisma.classification.findUnique({
        where: { id },
      });

      if (!existing) {
        res.status(404).json({ error: "Classification not found" });
        return;
      }

      // Only allow if admin or owner
      const isOwner = existing.userId === userId;
      const isAdmin = userRole === "admin";
      const isExpert = userRole === "expert-user";

      if (!isAdmin && !isOwner) {
        res
          .status(403)
          .json({ error: "Not authorized to update this classification" });
        return;
      }

      // Only allow isArchived change for owner, admin, or expert-user
      // Only allow classification change for admin or expert-user
      const updateData: any = {};

      if (typeof isArchived !== "undefined") {
        if (isAdmin || isOwner || isExpert) {
          updateData.isArchived = isArchived;
        } else {
          res
            .status(403)
            .json({ error: "Not authorized to update isArchived" });
          return;
        }
      }

      if (typeof classification !== "undefined") {
        if (isAdmin || isExpert) {
          updateData.classification = classification;
        } else {
          res
            .status(403)
            .json({ error: "Not authorized to update classification" });
          return;
        }
      }

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: "No valid fields to update" });
        return;
      }

      const updated = await prisma.classification.update({
        where: { id },
        data: updateData,
      });

      res.json({ message: "Classification updated", classification: updated });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  return {
    uploadImage,
    getClassifications,
    updateClassification,
  };
}

export default plantClassifierController;
