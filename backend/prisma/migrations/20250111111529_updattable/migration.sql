/*
  Warnings:

  - You are about to drop the `ba` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hvc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "classroomNumber" DROP CONSTRAINT "classroomNumber_vcID_fkey";

-- DropTable
DROP TABLE "ba";

-- DropTable
DROP TABLE "hvc";

-- DropTable
DROP TABLE "vc";

-- CreateTable
CREATE TABLE "classs" (
    "id" SERIAL NOT NULL,
    "classroom" TEXT,

    CONSTRAINT "classs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classs_classroom_key" ON "classs"("classroom");

-- AddForeignKey
ALTER TABLE "classroomNumber" ADD CONSTRAINT "classroomNumber_vcID_fkey" FOREIGN KEY ("vcID") REFERENCES "classs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
