/*
  Warnings:

  - You are about to drop the column `name_en` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `name_ru` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `name_uz` on the `Products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[frame_en]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[frame_uz]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[frame_ru]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `frame_en` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Products_name_en_key";

-- DropIndex
DROP INDEX "Products_name_ru_key";

-- DropIndex
DROP INDEX "Products_name_uz_key";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "name_en",
DROP COLUMN "name_ru",
DROP COLUMN "name_uz",
ADD COLUMN     "frame_en" TEXT NOT NULL,
ADD COLUMN     "frame_ru" TEXT,
ADD COLUMN     "frame_uz" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Products_frame_en_key" ON "Products"("frame_en");

-- CreateIndex
CREATE UNIQUE INDEX "Products_frame_uz_key" ON "Products"("frame_uz");

-- CreateIndex
CREATE UNIQUE INDEX "Products_frame_ru_key" ON "Products"("frame_ru");
