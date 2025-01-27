/*
  Warnings:

  - You are about to drop the column `advisor` on the `student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "classroomNumber" ADD COLUMN     "advisor" TEXT;

-- AlterTable
ALTER TABLE "student" DROP COLUMN "advisor";
