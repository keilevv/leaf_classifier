import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { baseShapes } from "../config";

function SpeciesController() {
  
  const getSpecies = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";
      const createdAt_gte = req.query.createdAt_gte as string;
      const createdAt_lte = req.query.createdAt_lte as string;
      const search = req.query.search as string;
      const isArchived = req.query.isArchived as string;
      const createdBy = req.query.createdBy as string;

      // Build Prisma where filter
      const where: any = {};


      // Only allow admin to filter by createdBy, otherwise restrict to own
      if (req.user.role === "ADMIN" && createdBy) {
        where.createdById = createdBy;
      } else {
        where.createdById = req.user.id;
      }

      // Filter by isArchived, default to false if not provided
      if (typeof req.query.isArchived !== "undefined") {
        if (req.query.isArchived === "true") where.isArchived = true;
        else if (req.query.isArchived === "false") where.isArchived = false;
      } else {
        where.isArchived = false;
      }

      // Date filters
      if (createdAt_gte || createdAt_lte) {
        where.createdAt = {};
        if (createdAt_gte) {
          where.createdAt.gte = new Date(createdAt_gte);
        }
        if (createdAt_lte) {
          where.createdAt.lte = new Date(createdAt_lte);
        }
      }

      // Search filter
      if (search) {
        where.OR = [
          { commonNameEs: { contains: search, mode: "insensitive" } },
          { commonNameEn: { contains: search, mode: "insensitive" } },
          { scientificName: { contains: search, mode: "insensitive" } },
        ];
      }

      const [species, count] = await Promise.all([
        prisma.species.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: { createdBy: true },
        }),
        prisma.species.count({ where }),
      ]);

      const totalPages = Math.ceil(count / limit);

      const response = {
        count,
        pages: totalPages,
        results: species,
        shapes: baseShapes,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  return { getSpecies };
}
export default SpeciesController;
