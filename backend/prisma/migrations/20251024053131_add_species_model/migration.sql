-- CreateTable
CREATE TABLE "public"."Species" (
    "id" TEXT NOT NULL,
    "commonNameEs" TEXT NOT NULL,
    "commonNameEn" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Species" ADD CONSTRAINT "Species_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
