/*
  Warnings:

  - The `bhk` column on the `Buyer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Buyer" DROP COLUMN "bhk",
ADD COLUMN     "bhk" TEXT;
