import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { baseShapes } from "../config";

function SpeciesController() {
  const getSpecies = async (
    req: Request,
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

      const authUser = (req as any).user as { id?: string } | undefined;
      const actingUser = authUser?.id
        ? await prisma.user.findUnique({
            where: {
              id: authUser.id,
            },
          })
        : null;
      // Build Prisma where filter
      const where: any = {};
  

      // Filter by isArchived, default to false if not provided
      if (typeof isArchived !== "undefined") {
        if (isArchived === "true") where.isArchived = true;
        else if (isArchived === "false") where.isArchived = false;
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
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  const createSpecies = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { scientificName, commonNameEn, commonNameEs } = req.body || {};
      if (!scientificName || !commonNameEn || !commonNameEs) {
        res.status(400).json({ error: "scientificName, commonNameEn and commonNameEs are required" });
        return;
      }
      const slug = String(scientificName)
        .normalize("NFD")
        .replace(/\p{Diacritic}+/gu, "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s.-]/g, "")
        .replace(/[\s._]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$|\.$/g, "");

      const existing = await prisma.species.findUnique({ where: { slug } });
      if (existing) {
        res.status(409).json({ error: "Species with this slug already exists" });
        return;
      }

      const authUser = (req as any).user as { id?: string } | undefined;
      if (!authUser?.id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const created = await prisma.species.create({
        data: {
          scientificName,
          commonNameEn,
          commonNameEs,
          slug,
          createdById: authUser.id,
        },
        include: { createdBy: true },
      });

      res.status(201).json({ species: created });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  return { getSpecies, createSpecies };
}
export default SpeciesController;
