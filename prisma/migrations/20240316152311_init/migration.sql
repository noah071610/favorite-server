/*
  Warnings:

  - You are about to drop the `Save` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `save` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Save" DROP CONSTRAINT "Save_userId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "save" JSONB NOT NULL;

-- DropTable
DROP TABLE "Save";
