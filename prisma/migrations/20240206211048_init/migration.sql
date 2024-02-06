/*
  Warnings:

  - You are about to drop the `PostInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `info` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostInfo" DROP CONSTRAINT "PostInfo_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "info" JSONB NOT NULL;

-- DropTable
DROP TABLE "PostInfo";
