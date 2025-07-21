-- CreateEnum
CREATE TYPE "StatusENum" AS ENUM ('OutOfStock', 'Recommend', 'Sale', 'Block');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "name_en" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "status" "StatusENum";
