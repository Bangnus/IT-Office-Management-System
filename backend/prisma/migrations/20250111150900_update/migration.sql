/*
  Warnings:

  - The `image` column on the `student` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "student" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA;
