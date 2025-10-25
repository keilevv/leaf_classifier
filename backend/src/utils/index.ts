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

export async function updateIsHealthy() {
  const classifications = await prisma.classification.findMany({});

  classifications.map(async (classification) => {
    const isHealthy = classification.imagePath.includes("healthy");
    console.log("isHealthy", isHealthy);
    const updatedClassification = await prisma.classification.update({
      where: { id: classification.id },
      data: { isHealthy: isHealthy },
    });
    console.log("Default classification updated:");
    console.log(`  ID: ${updatedClassification.id}`);
    console.log(`  Is Healthy: ${updatedClassification.isHealthy}`);
  });
}

export async function updateImagePathByIsHealthy() {
  const classifications = await prisma.classification.findMany({});

  classifications.map(async (classification) => {
    const imagePath = classification.imagePath.split("/").pop();
    let newImagePath = "";
    if (imagePath?.includes("healthy") && !classification.isHealthy) {
      newImagePath = imagePath.replace("healthy", "deseased");
    } else {
      if (imagePath?.includes("deseased") && classification.isHealthy) {
        newImagePath = imagePath.replace("deseased", "healthy");
      }
    }
    console.log("imagePath", imagePath);
    console.log("isHealthy", classification.isHealthy);
    console.log("newImagePath", newImagePath);
  });
}

export async function updateSpecies() {
  const species = await prisma.species.findMany({});
  species.map(async (species) => {
    const foundMatch = baseSpecies.find(
      (sp) => sp.scientificName === species.scientificName
    );
    if (
      foundMatch &&
      (foundMatch.key !== species.key ||
        foundMatch.commonNameEs !== species.commonNameEs ||
        foundMatch.commonNameEn !== species.commonNameEn)
    ) {
      await prisma.species.update({
        where: { id: species.id },
        data: {
          commonNameEs: foundMatch.commonNameEs,
          commonNameEn: foundMatch.commonNameEn,
          scientificName: foundMatch.scientificName,
          key: foundMatch.key,
        },
      });
    }
  });
}

export async function formatClassificationSpecies() {
  const classifications = await prisma.classification.findMany({});
  classifications.map(async (classification) => {
    if (classification.species.includes("_")) {
      const updatedClassification = await prisma.classification.update({
        where: { id: classification.id },
        data: {
          species: classification.species.split("_")[0],
        },
      });
      console.log("Updated classification:", updatedClassification);
    }
  });
}
