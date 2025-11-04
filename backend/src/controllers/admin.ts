import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { R2Service } from "../services/r2Service";
import { sanitizeUser } from "../utils";
import { baseShapes } from "../config";

function adminController() {
  async function getClassificationsAdmin(
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

      const actingUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (actingUser?.role !== "ADMIN" && actingUser?.role !== "MODERATOR") {
        res.status(403).json({ error: "Unauthorized" });
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
      const classificationsWithUser = await Promise.all(
        classifications.map(async (classification) => {
          return {
            ...classification,
            user: classification.user
              ? sanitizeUser(classification.user)
              : undefined,
          };
        })
      );

      const totalPages = Math.ceil(count / limit);

      const response = {
        count,
        pages: totalPages,
        totalVerifiedCount,
        totalPendingCount,
        totalArchivedCount,
        results: classificationsWithUser,
        shapes: baseShapes,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch classifications",
        message: error.message,
      });
    }
  }

  const getClassificationAdmin = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const id = req.params.id;
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }
      const actingUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (actingUser?.role !== "ADMIN" && actingUser?.role !== "MODERATOR") {
        res.status(403).json({ error: "Unauthorized" });
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
        results: { ...classification },
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch classification",
        message: error.message,
      });
    }
  };

  const updateClassificationAdmin = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const id = req.params.id;
    const { taggedShape, taggedSpecies, isHealthy, status, isArchived } =
      req.body;
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }
      const actingUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
      if (actingUser?.role !== "ADMIN" && actingUser?.role !== "MODERATOR") {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }
      const classification = await prisma.classification.update({
        where: { id },
        data: { taggedShape, taggedSpecies, isHealthy, status, isArchived },
      });

      const response = {
        message: "Classification updated successfully",
        results: { ...classification },
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: "Failed to update classification",
        message: error.message,
      });
    }
  };

  const deleteClassificationAdmin = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const id = req.params.id;
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }
      const actingUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
      if (actingUser?.role !== "ADMIN") {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }
      const classification = await prisma.classification.delete({
        where: { id },
      });
      const response = {
        message: "Classification deleted successfully",
        results: classification,
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: "Failed to delete classification",
        message: error.message,
      });
    }
  };

  const getUsersAdmin = async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";
    const searchQuery = (req.query.search as string) || "";
    const role = (req.query.role as string) || "ALL";
    const isArchived = (req.query.isArchived as string) || "false";
    const requestedContributorStatus =
      (req.query.requestedContributorStatus as string) || "false";

    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const actingUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (actingUser?.role !== "ADMIN" && actingUser?.role !== "MODERATOR") {
        res.status(403).json({ error: "Unauthorized" });
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

      // requestedContributorStatus filter
      if (typeof req.query.requestedContributorStatus !== "undefined") {
        const val = req.query.requestedContributorStatus as string;
        if (val === "true") where.requestedContributorStatus = true;
        else if (val === "false") where.requestedContributorStatus = false;
      }

      const [users, count, requestedContributorCount] = await Promise.all([
        prisma.user.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: { _count: { select: { classifications: true } } },
        }),
        prisma.user.count({ where }),
        prisma.user.count({
          where: {
            role: "USER",
            requestedContributorStatus: true,
          },
        }),
      ]);
      const usersWithCounts = users.map((user) => ({
        ...sanitizeUser(user as any),
        classificationCount: (user as any)._count?.classifications ?? 0,
      }));

      const totalPages = Math.ceil(count / limit);

      const response = {
        count,
        requestedContributorCount,
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

  const getUserAdmin = async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id;
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const adminUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!adminUser) {
        res.status(404).json({ error: "Admin user not found" });
        return;
      }

      if (adminUser.role !== "ADMIN" && adminUser.role !== "MODERATOR") {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id },
        include: { _count: { select: { classifications: true } } },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const response = {
        message: "User fetched successfully",
        results: sanitizeUser(user as any),
        classificationCount: (user as any)._count?.classifications ?? 0,
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch user",
        message: error.message,
      });
    }
  };

  const updateUserAdmin = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const {
        fullName,
        email,
        phone,
        institution,
        department,
        location,
        bio,
        password,
        emailNotifications,
        role,
        isArchived,
        requestedContributorStatus,
      } = req.body;
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Authorization: only same user or admin
      const authUser = (req as any).user as { id?: string } | undefined;
      if (!authUser?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (authUser.id !== id) {
        const actingUser = await prisma.user.findUnique({
          where: { id: authUser.id },
        });
        if (!actingUser || actingUser.role !== "ADMIN") {
          return res.status(403).json({ error: "Forbidden" });
        }
      }
      const data: any = {
        fullName,
        email,
        phone,
        institution,
        department,
        location,
        bio,
        emailNotifications,
        role,
        isArchived,
        requestedContributorStatus,
      };
      if (
        password &&
        typeof password === "string" &&
        password.trim().length > 0
      ) {
        const hash = await bcrypt.hash(password, 10);
        data.passwordHash = hash;
      }
      const updatedUser = await prisma.user.update({
        where: { id },
        data,
      });
      return res.json({ user: sanitizeUser(updatedUser) });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  return {
    getUsersAdmin,
    getClassificationsAdmin,
    getClassificationAdmin,
    updateClassificationAdmin,
    deleteClassificationAdmin,
    getUserAdmin,
    updateUserAdmin,
  };
}

export default adminController;
