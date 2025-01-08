-- CreateTable
CREATE TABLE "vcstudent" (
    "id" SERIAL NOT NULL,
    "studentID" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "vcroomID" INTEGER,
    "hvcroomID" INTEGER,
    "baroom" INTEGER,

    CONSTRAINT "vcstudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vc" (
    "id" SERIAL NOT NULL,
    "classroom" TEXT,

    CONSTRAINT "vc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classroomNumber" (
    "id" SERIAL NOT NULL,
    "className" TEXT,

    CONSTRAINT "classroomNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hvc" (
    "id" SERIAL NOT NULL,
    "classroom" TEXT,

    CONSTRAINT "hvc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ba" (
    "id" SERIAL NOT NULL,
    "classroom" TEXT,

    CONSTRAINT "ba_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vcstudent" ADD CONSTRAINT "vcstudent_vcroomID_fkey" FOREIGN KEY ("vcroomID") REFERENCES "vc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vcstudent" ADD CONSTRAINT "vcstudent_hvcroomID_fkey" FOREIGN KEY ("hvcroomID") REFERENCES "hvc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vcstudent" ADD CONSTRAINT "vcstudent_baroom_fkey" FOREIGN KEY ("baroom") REFERENCES "ba"("id") ON DELETE SET NULL ON UPDATE CASCADE;
