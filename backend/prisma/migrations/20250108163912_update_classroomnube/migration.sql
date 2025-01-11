-- AlterTable
ALTER TABLE "classroomNumber" ADD COLUMN     "vcID" INTEGER;

-- AddForeignKey
ALTER TABLE "classroomNumber" ADD CONSTRAINT "classroomNumber_vcID_fkey" FOREIGN KEY ("vcID") REFERENCES "vc"("id") ON DELETE SET NULL ON UPDATE CASCADE;
