/*
  Warnings:

  - You are about to drop the column `frameId` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the `Frame` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name_en]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_uz]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_ru]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_en` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_frameId_fkey";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "frameId",
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_ru" TEXT,
ADD COLUMN     "name_uz" TEXT;

-- DropTable
DROP TABLE "Frame";

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_en_key" ON "Products"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_uz_key" ON "Products"("name_uz");

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_ru_key" ON "Products"("name_ru");
