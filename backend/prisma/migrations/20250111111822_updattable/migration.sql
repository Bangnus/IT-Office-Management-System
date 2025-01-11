/*
  Warnings:

  - You are about to drop the `classs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "classroomNumber" DROP CONSTRAINT "classroomNumber_vcID_fkey";

-- DropTable
DROP TABLE "classs";

-- CreateTable
CREATE TABLE "vc" (
    "id" SERIAL NOT NULL,
    "classroom" TEXT,

    CONSTRAINT "vc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vc_classroom_key" ON "vc"("classroom");

-- AddForeignKey
ALTER TABLE "classroomNumber" ADD CONSTRAINT "classroomNumber_vcID_fkey" FOREIGN KEY ("vcID") REFERENCES "vc"("id") ON DELETE SET NULL ON UPDATE CASCADE;
