import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
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

      if (status !== "ALL") {
        where.status = status;
      }

      if (isArchived === "true") {
        where.isArchived = true;
      } else if (isArchived === "false" || isArchived === "undefined") {
        where.isArchived = false;
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
            user: {
              is: {
                fullName: { contains: searchQuery, mode: "insensitive" },
              },
            },
          },
          {
            user: {
              is: { email: { contains: searchQuery, mode: "insensitive" } },
            },
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
      const classificationsWithUser = classifications.map((classification) => {
        return {
          ...classification,
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
        results: classificationsWithUser,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch classifications",
        message: error.message,
      });
    }
  }

  const getAdminClassification = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const id = req.params.id;
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }
      const classification = await prisma.classification.findUnique({
        where: { id },
        include: { user: true },
      });
      if (!classification) {
        res.status(404).json({ error: "Classification not found" });
        return;
      }
      const response = {
        message: "Classification fetched successfully",
        results: classification,
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch classification",
        message: error.message,
      });
    }
  };

  const updateAdminClassification = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const id = req.params.id;
    const { shape, species, status } = req.body;
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }
      if (req.user.role !== "ADMIN") {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }
      const classification = await prisma.classification.update({
        where: { id },
        data: { shape, species, status },
      });
      const response = {
        message: "Classification updated successfully",
        results: classification,
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: "Failed to update classification",
        message: error.message,
      });
    }
  };

  const getAdminUsers = async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";
    const searchQuery = (req.query.search as string) || "";
    const role = (req.query.role as string) || "ALL";
    const isArchived = (req.query.isArchived as string) || "false";

    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }
      const where: any = {};

      if (role !== "ALL") {
        where.role = role;
      }
      if (isArchived === "true") {
        where.isArchived = true;
      } else if (isArchived === "false" || isArchived === "undefined") {
        where.isArchived = false;
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

      // Search query
      if (searchQuery) {
        where.OR = [
          { email: { contains: searchQuery, mode: "insensitive" } },
          { fullName: { contains: searchQuery, mode: "insensitive" } },
        ];
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

  return {
    getAdminUsers,
    getAdminClassifications,
    getAdminClassification,
    updateAdminClassification,
  };
}

export default adminController;
