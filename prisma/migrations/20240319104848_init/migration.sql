/*
  Warnings:

  - Added the required column `lang` to the `HomepageData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `HomepageData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HomepageData" ADD COLUMN     "lang" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
