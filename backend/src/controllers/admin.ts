import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/intex";
import { R2Service } from "../services/r2Service";
import { sanitizeUser } from "../utils";

function adminController() {
  async function getAdminClassifications(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";
    const searchQuery = (req.query.search as string) || "";
    const status = (req.query.status as string) || "ALL";
    const isArchived = (req.query.isArchived as string) || "false";

    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      // Build Prisma where filter
      const where: any = {};

      if (isArchived === "true") {
        where.isArchived = true;
      } else if (isArchived === "false" || isArchived === "undefined") {
        where.isArchived = false;
      }

      if (status !== "ALL") {
        where.status = status;
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

      // Search filter
      if (searchQuery) {
        where.OR = [
          { shape: { contains: searchQuery, mode: "insensitive" } },
          { species: { contains: searchQuery, mode: "insensitive" } },
          { originalFilename: { contains: searchQuery, mode: "insensitive" } },
          {
            user: { fullName: { contains: searchQuery, mode: "insensitive" } },
          },
          {
            user: { email: { contains: searchQuery, mode: "insensitive" } },
          },
        ];
      }

      const [
        classifications,
        count,
        totalVerifiedCount,
        totalPendingCount,
        totalArchivedCount,
      ] = await Promise.all([
        prisma.classification.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: { user: true },
        }),
        prisma.classification.count({ where }),
        prisma.classification.count({
          where: { ...where, status: "VERIFIED", isArchived: false },
        }),
        prisma.classification.count({
          where: { ...where, status: "PENDING", isArchived: false },
        }),
        prisma.classification.count({ where: { ...where, isArchived: true } }),
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
          user: classification.user
            ? sanitizeUser(classification.user)
            : undefined,
        };
      });

      const totalPages = Math.ceil(count / limit);

      const response = {
        count,
        pages: totalPages,
        totalVerifiedCount,
        totalPendingCount,
        totalArchivedCount,
        results: classificationsWithUrls,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch classifications",
        message: error.message,
      });
    }
  }
  const getAdminUsers = async (req: AuthenticatedRequest, res: Response) => {
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
      const where: any = {};

      // // Filter by isArchived, default to false if not provided
      // if (typeof req.query.isArchived !== "undefined") {
      //   if (req.query.isArchived === "true") where.isArchived = true;
      //   else if (req.query.isArchived === "false") where.isArchived = false;
      // } else {
      //   where.isArchived = false;
      // }

      // Filter by originalFilename (partial match)
      if (req.query.email) {
        where.email = {
          contains: req.query.email as string,
          mode: "insensitive",
        };
      }

      if (req.query.fullName) {
        where.fullName = {
          contains: req.query.fullName as string,
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

      const [users, count] = await Promise.all([
        prisma.user.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: { _count: { select: { classifications: true } } },
        }),
        prisma.user.count({ where }),
      ]);
      const usersWithCounts = users.map((user) => ({
        ...sanitizeUser(user as any),
        classificationCount: (user as any)._count?.classifications ?? 0,
      }));

      const totalPages = Math.ceil(count / limit);

      const response = {
        count,
        pages: totalPages,
        results: usersWithCounts,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch users",
        message: error.message,
      });
    }
  };

  return { getAdminUsers, getAdminClassifications };
}

export default adminController;
