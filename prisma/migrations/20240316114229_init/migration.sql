/*
  Warnings:

  - You are about to drop the column `content` on the `Save` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Save` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data` to the `Save` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Save" DROP COLUMN "content",
ADD COLUMN     "data" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Save_userId_key" ON "Save"("userId");
