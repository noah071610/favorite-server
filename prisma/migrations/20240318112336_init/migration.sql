/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comments` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lang` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lang` to the `Save` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "comments" TEXT NOT NULL,
ADD COLUMN     "lang" TEXT NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Save" ADD COLUMN     "lang" TEXT NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Comment";

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "postId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'template',
    "thumbnail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "popular" INTEGER NOT NULL DEFAULT 0,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lang" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("postId")
);
