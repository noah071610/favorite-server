/*
  Warnings:

  - Added the required column `rawData` to the `HomepageData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HomepageData" ADD COLUMN     "rawData" TEXT NOT NULL;
