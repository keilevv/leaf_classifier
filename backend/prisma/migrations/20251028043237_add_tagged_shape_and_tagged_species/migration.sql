-- AlterTable
ALTER TABLE "public"."Classification" ADD COLUMN     "taggedShape" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "taggedSpecies" TEXT NOT NULL DEFAULT '';
