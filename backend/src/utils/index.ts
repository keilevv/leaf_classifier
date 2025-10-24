import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { baseSpecies } from "../config";

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

export async function createDefaultSpecies() {
  const defaultEmail = process.env.DEFAULT_EMAIL || "adminleaf@yopmail.com";
  const speciesCount = await prisma.species.count({});
  if (speciesCount > 0) {
    return null; // Species already exists
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });

  baseSpecies.map(async (defaultSpecies) => {
    const existingSpecies = await prisma.species.findUnique({
      where: { scientificName: defaultSpecies.scientificName },
    });
    if (existingSpecies) {
      return null; // Species with default scientific name already exists
    }

    const species = await prisma.species.create({
      data: {
        commonNameEs: defaultSpecies.commonNameEs,
        commonNameEn: defaultSpecies.commonNameEn,
        scientificName: defaultSpecies.scientificName,
        createdById: adminUser?.id,
      },
    });

    console.log("Default species created:");
    console.log(`  Common Name: ${species.commonName}`);
    console.log(`  Scientific Name: ${species.scientificName}`);
    return species;
  });
}
