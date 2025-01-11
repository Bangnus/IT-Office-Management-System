/*
  Warnings:

  - You are about to drop the column `baroom` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `hvcroomID` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `vcroomID` on the `student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_baroom_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_hvcroomID_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_vcroomID_fkey";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "baroom",
DROP COLUMN "hvcroomID",
DROP COLUMN "vcroomID";
