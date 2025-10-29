import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { sanitizeUser } from "../utils";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

function userController() {
  // Get current user profile
  const getUser = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ user: sanitizeUser(user) });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  const updateUser = async (req: Request, res: Response) => {
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

  return { getUser, updateUser };
}

export default userController;
