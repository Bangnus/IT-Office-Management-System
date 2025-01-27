const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

exports.addLeave = async (req, res) => {
    try {
        const { description, teacherID, date } = req.body

        const addleave = await prisma.leave.create({
            data: {
                description,
                teacherID: parseInt(teacherID, 10),
                date
            }
        })
        return res.status(200).json({
            message: "Create LeaveTeacher Successfully",
            body: addleave
        })
    } catch (error) {
        return res.status(500).json({
            massage: "create error",
            error: error,
        })
    }
}

exports.fetchleaveID = async (req, res) => {
    try {
        const { id } = req.params
        const fetchleave = await prisma.leave.findMany({
            where: {
                teacherID: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "Fetch LeaveTeacher Successfully",
            body: fetchleave
        })
    } catch (error) {
        return res.status(500).json({
            massage: "fetch error",
            error: error.message,
        })
    }
}