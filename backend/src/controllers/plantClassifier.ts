import prisma from "../lib/prisma";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { R2Service } from "../services/r2Service";
import { v4 as uuidv4 } from "uuid";

// Extend the Request interface to include user and file properties
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
  file?: any; // Multer file object
}

const classifierServiceUrl =
  process.env.CLASSIFY_SERVICE_URL || "http://localhost:8000/";

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

      // Save image to temporary uploads folder
      const uploadPath = path.join(
        process.cwd(),
        "uploads",
        image.originalname
      );

      fs.renameSync(image.path, uploadPath);

      if (!fs.existsSync(uploadPath)) {
        return res
          .status(404)
          .json({ error: `File not found at ${uploadPath}` });
      }

      try {
        // Step 1: Get classification from external service first
        const formData = new FormData();
        formData.append(
          "image",
          fs.createReadStream(uploadPath),
          image.originalname
        );

        await axios
          .post(`${classifierServiceUrl}/predict`, formData, {
            headers: {
              ...formData.getHeaders(),
            },
          })
          .then(async (response) => {
            const { model1, model2, model3 } = response.data;

            if (model3.class_name) {
              const species = model1.class_name;
              const species_confidence = model1.probability;
              const shape = model2.class_name;
              const shape_confidence = model2.probability;

              // Step 2: Generate unique ID and create R2 key based on classification
              const uniqueId = uuidv4().replace(/-/g, "").substring(0, 8);
              const fileExtension = path.extname(image.originalname);
              const r2Key = R2Service.generateImageKey(
                species,
                uniqueId,
                fileExtension
              );

              // Step 3: Upload to Cloudflare R2
              const uploadResult = await R2Service.uploadFile(
                uploadPath,
                r2Key,
                image.mimetype
              );

              let finalImagePath: string;
              let imageUrl: string;

              if (!uploadResult.success) {
                // Check if it's a size-related error
                if (
                  uploadResult.error?.includes("too small") ||
                  uploadResult.error?.includes("EntityTooSmall") ||
                  R2Service.isFileTooSmall(uploadPath)
                ) {
                  // Fallback: Store locally for small files
                  const localPath = `uploads/${r2Key}`;
                  const localUploadPath = path.join(process.cwd(), localPath);

                  // Ensure uploads directory exists
                  const uploadsDir = path.join(process.cwd(), "uploads");
                  if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                  }

                  // Copy file to local storage
                  fs.copyFileSync(uploadPath, localUploadPath);
                  finalImagePath = localPath;
                  imageUrl = `/uploads/${r2Key}`;
                } else {
                  // Clean up temporary file for other errors
                  fs.unlinkSync(uploadPath);
                  return res.status(500).json({
                    error: uploadResult.error,
                    message: "Error uploading to R2",
                  });
                }
              } else {
                // R2 upload successful
                finalImagePath = r2Key;
                imageUrl = uploadResult.url!;
              }

              // Step 4: Create classification entry in DB with final path
              const classificationEntry = await prisma.classification.create({
                data: {
                  originalFilename: image.originalname,
                  imagePath: imageUrl, // Store final path (R2 key or local path)
                  species,
                  shape,
                  speciesConfidence: species_confidence,
                  shapeConfidence: shape_confidence,
                  userId,
                },
              });

              // Step 5: Clean up temporary local file
              fs.unlinkSync(uploadPath);

              // Add full URL for the response
              const classificationWithUrl = {
                ...classificationEntry,
                imageUrl: imageUrl,
              };

              return res.status(200).json({
                message: "Image uploaded and classified successfully",
                classification: classificationWithUrl,
                storageType: uploadResult.success ? "R2" : "local",
                imageUrl: imageUrl,
              });
            } else {
              return res.status(400).json({
                error: "no_plant",
                message: "Image is not a plant",
              });
            }
          })
          .catch((error) => {
            console.error("Error classifying image:", error);
          });
      } catch (classificationError) {
        // Clean up temporary file on classification error
        if (fs.existsSync(uploadPath)) {
          fs.unlinkSync(uploadPath);
        }

        return res.status(500).json({
          error:
            classificationError instanceof Error
              ? classificationError.message
              : "Unknown error",
          message: "Error classifying image",
        });
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

      // Add full URL for images (R2 or local)
      const classificationsWithUrls = classifications.map((classification) => {
        let imageUrl: string;

        if (R2Service.isR2Key(classification.imagePath)) {
          // R2 image
          imageUrl = R2Service.getPublicUrl(classification.imagePath);
        } else if (classification.imagePath.startsWith("uploads/")) {
          // Local image with uploads/ prefix
          imageUrl = `/${classification.imagePath}`;
        } else {
          // Fallback to original path
          imageUrl = classification.imagePath;
        }

        return {
          ...classification,
          imageUrl,
        };
      });

      const totalPages = Math.ceil(count / limit);

      const response = {
        count,
        pages: totalPages,
        results: classificationsWithUrls,
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

      // Add full URL for images (R2 or local)
      let imageUrl: string;

      if (R2Service.isR2Key(updated.imagePath)) {
        // R2 image
        imageUrl = R2Service.getPublicUrl(updated.imagePath);
      } else if (updated.imagePath.startsWith("uploads/")) {
        // Local image with uploads/ prefix
        imageUrl = `/${updated.imagePath}`;
      } else {
        // Fallback to original path
        imageUrl = updated.imagePath;
      }

      const updatedWithUrl = {
        ...updated,
        imageUrl,
      };

      res.json({
        message: "Classification updated",
        classification: updatedWithUrl,
      });
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
