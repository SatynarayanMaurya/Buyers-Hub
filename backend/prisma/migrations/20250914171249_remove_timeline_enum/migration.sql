/*
  Warnings:

  - Changed the type of `timeline` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Buyer" DROP COLUMN "timeline",
ADD COLUMN     "timeline" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."BHK";

-- DropEnum
DROP TYPE "public"."Timeline";
