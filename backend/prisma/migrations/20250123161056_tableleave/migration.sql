-- CreateTable
CREATE TABLE "leave" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "teacherID" INTEGER,

    CONSTRAINT "leave_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "leave" ADD CONSTRAINT "leave_teacherID_fkey" FOREIGN KEY ("teacherID") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
