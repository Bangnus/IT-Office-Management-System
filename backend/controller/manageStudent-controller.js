const { PrismaClient } = require('@prisma/client');
const { json } = require('express');

const prisma = new PrismaClient();

exports.addstudent = async (req, res) => {
    try {
        // ตรวจสอบว่า req.body และ req.file ถูกส่งมาหรือไม่
        const { studentID, firstname, lastname, classroom } = req.body;

        const classroomInt = parseInt(classroom, 10)

        const addstudent = await prisma.student.create({
            data: {
                studentID,
                firstname,
                lastname,
                classroom: classroomInt,
            }
        });

        return res.status(200).json({
            message: "Create student successfully",
            body: addstudent,
        });

    } catch (error) {
        console.error(error);  // แสดง error เพื่อดีบัก
        if (error.code === "P2002") {
            return res.status(400).json({
                message: "StudentID already exists"
            });
        }
        return res.status(500).json({
            message: "Create student error",
            error: error.message || error,
        });
    }
}


exports.editstudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { studentID, firstname, lastname } = req.body;

        const editstudent = await prisma.student.update({
            where: {
                id: parseInt(id)
            },
            data: {
                studentID,
                firstname,
                lastname,
                
            }
        })
        return res.status(200).json({
            massage: "update student successfully",
            body: editstudent
        })
    } catch (error) {
        return res.status(500).json({
            massage: "update student error",
            error: error,
        })
    }
}

exports.deletestudent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletestudent = await prisma.student.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            massage: "delete student successfully",
            body: deletestudent
        })
    } catch (error) {
        return res.status(500).json({
            massage: "delete student fiald",
            error: error
        })
    }
}

exports.students = async (req, res) => {
    try {
        // const { id } = req.params
        const students = await prisma.student.findMany({
            // where: {
            //     classroomNumber: {
            //         vcID: Number(id)
            //     }
            // },
            include: {
                classroomNumber: {
                    include: {
                        vc: true
                    }
                }
            }
        })
        return res.status(200).json({
            message: "Success",
            body: students
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error",
            error: error
        })
    }
}
exports.studentsID = async (req, res) => {
    try {
        const { id } = req.params
        const students = await prisma.student.findMany({
            where: {
                classroomNumber: {
                    id: parseInt(id)
                }
            },
            include: {
                classroomNumber: {
                    include: {
                        vc: true
                    }
                }
            }
        })
        return res.status(200).json({
            message: "Success",
            body: students
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error",
            error: error
        })
    }
}

exports.fetchEditstudentID = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await prisma.student.findMany({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "ftching student successfully",
            body: response,
        })
    } catch (error) {
        return res.status(500).json({
            message: "fetching student faild",
            error: error.message
        })
    }
}