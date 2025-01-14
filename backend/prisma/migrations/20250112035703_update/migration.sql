/*
  Warnings:

  - You are about to drop the column `image` on the `student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "classroomNumberID" INTEGER,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_classroomNumberID_fkey" FOREIGN KEY ("classroomNumberID") REFERENCES "classroomNumber"("id") ON DELETE SET NULL ON UPDATE CASCADE;
