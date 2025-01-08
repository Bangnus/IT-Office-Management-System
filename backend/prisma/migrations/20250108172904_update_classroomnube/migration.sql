/*
  Warnings:

  - You are about to drop the `vcstudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "vcstudent" DROP CONSTRAINT "vcstudent_baroom_fkey";

-- DropForeignKey
ALTER TABLE "vcstudent" DROP CONSTRAINT "vcstudent_hvcroomID_fkey";

-- DropForeignKey
ALTER TABLE "vcstudent" DROP CONSTRAINT "vcstudent_vcroomID_fkey";

-- DropTable
DROP TABLE "vcstudent";

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "studentID" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "vcroomID" INTEGER,
    "hvcroomID" INTEGER,
    "baroom" INTEGER,
    "classroom" INTEGER,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_vcroomID_fkey" FOREIGN KEY ("vcroomID") REFERENCES "vc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_hvcroomID_fkey" FOREIGN KEY ("hvcroomID") REFERENCES "hvc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_baroom_fkey" FOREIGN KEY ("baroom") REFERENCES "ba"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_classroom_fkey" FOREIGN KEY ("classroom") REFERENCES "classroomNumber"("id") ON DELETE SET NULL ON UPDATE CASCADE;
