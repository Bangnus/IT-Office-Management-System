/*
  Warnings:

  - A unique constraint covering the columns `[className]` on the table `classroomNumber` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentID]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[classroom]` on the table `vc` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "classroomNumber_className_key" ON "classroomNumber"("className");

-- CreateIndex
CREATE UNIQUE INDEX "student_studentID_key" ON "student"("studentID");

-- CreateIndex
CREATE UNIQUE INDEX "vc_classroom_key" ON "vc"("classroom");
