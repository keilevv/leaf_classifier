/*
  Warnings:

  - Added the required column `originalFilename` to the `Classification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Classification" ADD COLUMN     "originalFilename" TEXT NOT NULL;
