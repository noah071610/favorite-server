/*
  Warnings:

  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Template";

-- CreateTable
CREATE TABLE "HomepageData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HomepageData_id_key" ON "HomepageData"("id");
