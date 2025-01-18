const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

exports.addTeacher = async (req, res) => {
    try {
        const { fullName, position, } = req.body;
        const TeacherImage = req.file ? req.file.path : null;

        const teacherData = await prisma.Teacher.create({
            data: {
                fullName,
                position,
                TeacherImage,
            }
        })
        return res.status(200).json({
            message: "add Teacher successfully",
            body: teacherData,
        })
    } catch (error) {
        return res.status(500).json({
            message: "add Teacher failed",
            error: error.message,
        })
    }
}

exports.editTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, position } = req.body;
        const TeacherImage = req.file ? req.file.path : null;

        // ตรวจสอบว่ามี Teacher อยู่หรือไม่
        const existingTeacher = await prisma.Teacher.findFirst({
            where: { id: parseInt(id, 10) },
        });

        if (!existingTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // ลบรูปภาพเก่าหากมี
        if (existingTeacher.TeacherImage) {
            const oldImagePath = existingTeacher.TeacherImage;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // อัปเดตข้อมูล
        const updatedTeacher = await prisma.Teacher.update({
            where: { id: parseInt(id, 10) },
            data: {
                fullName,
                position,
                TeacherImage, // อัปเดตรูปภาพใหม่
            },
        });

        return res.status(200).json({
            message: "Update Teacher successfully",
            body: updatedTeacher,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Update Teacher failed",
            error: error.message,
        });
    }
};

exports.fetchTeacher = async (req, res) => {
    try {
        const fetchdata = await prisma.Teacher.findMany({

        })
        return res.status(200).json({
            message: "fetch teacher successfuly",
            body: fetchdata,
        })
    } catch (error) {
        return res.status(500).json({
            message: "fetching teacher failed",
            error: error.message,
        })
    }
}

exports.fetchTeacherID = async (req, res) => {
    try {
        const { id } = req.params
        const fetchdata = await prisma.Teacher.findMany({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "fetch teacher successfuly",
            body: fetchdata,
        })
    } catch (error) {
        return res.status(500).json({
            message: "fetching teacher failed",
            error: error.message,
        })
    }
}

exports.deleteteacher = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await prisma.Teacher.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "delete teacher successfuly",
            body: data,
        })
    } catch (error) {
        return res.status(500).json({
            message: "delete teacher failed",
            error: error.message,
        })
    }
}
