import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

export function sanitizeUser(user: any) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function createDefaultAdmin() {
  const defaultEmail = process.env.DEFAULT_EMAIL || "adminleaf@yopmail.com";
  const defaultUsername = process.env.DEFAULT_USERNAME || "admin";
  const defaultPassword = process.env.DEFAULT_PASSWORD || "admin123";
  const userCount = await prisma.user.count({});
  if (userCount > 0) {
    return null; // Admin user already exists
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });
  if (existingAdmin) {
    return null; // Admin user with default email already exists
  }

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  const adminUser = await prisma.user.create({
    data: {
      email: defaultEmail,
      fullName: "Admin User",
      phone: "",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Default admin user created:");
  console.log(`  Username: ${defaultUsername}`);
  console.log(`  Password: ${defaultPassword}`);
  return adminUser;
}
