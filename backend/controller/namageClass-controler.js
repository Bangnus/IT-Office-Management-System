const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

exports.addvc = async (req, res) => {
    try {
        const { classroom } = req.body

        const addclass = await prisma.vc.create({
            data: {
                classroom
            }
        })
        return res.status(200).json({
            massage: "create class successfully",
            body: addclass,
        })
    } catch (error) {
        return res.status(500).json({
            massage: "create error",
            error: error,
        })
    }
}

exports.addclassnum = async (req, res) => {
    try {
        const { className, vcID } = req.body;

        const addclass = await prisma.classroomNumber.create({
            data: {
                className,
                vcID,
            }
        })
        return res.status(299).json({
            massage: "create classroom successfullt",
            body: addclass,
        })
    } catch (error) {
        return res.status(500).json({
            massage: "create error",
            error: error,
        })
    }
}

exports.addstudent = async (req, res) => {
    try {
        const { studentID, firstname, lastname, classroom } = req.body;

        const addstudent = await prisma.student.create({
            data: {
                studentID,
                firstname,
                lastname,
                classroom,
            }
        })
        return res.status(200).json({
            massage: "create student seccessfully",
            body: addstudent,
        })
    } catch (error) {
        return res.status(500).json({
            massage: "create student error",
            error: error,
        })
    }
}


exports.editclassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const { className } = req.body;

        const editclassroom = await prisma.classroomNumber.update({
            where: {
                id: parseInt(id),
            },
            data: {
                className
            }
        })
        return res.status(200).json({
            massage: "edit classroom successfully",
            body: editclassroom,
        })
    } catch (error) {
        return res.status(500).json({
            massage: "edit classroom error",
            error: error,
        })
    }
}