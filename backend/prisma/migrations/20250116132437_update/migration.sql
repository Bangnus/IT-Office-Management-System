-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT,
    "position" TEXT,
    "TeacherImage" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classroom" (
    "id" SERIAL NOT NULL,
    "roomID" TEXT,
    "roomname" TEXT,

    CONSTRAINT "classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "number" TEXT,
    "image" TEXT,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);
