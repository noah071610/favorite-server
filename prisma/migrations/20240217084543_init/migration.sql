/*
  Warnings:

  - Added the required column `format` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "format" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
