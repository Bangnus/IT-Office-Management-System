const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

exports.addclassroom = async (req, res) => {
    try {
        const { roomID, roomname } = req.body;

        const classroomdata = await prisma.classroom.create({
            data: {
                roomID,
                roomname
            }
        })
        return res.status(200).json({
            message: "add classroom successful",
            body: classroomdata
        })
    } catch (error) {
        return res.status(500).json({
            message: "add classroom filaed",
            error: error.message,
        })
    }
}
exports.Editlassroom = async (req, res) => {
    try {
        const { id } = req.params
        const { roomID, roomname } = req.body;

        const classroomdata = await prisma.classroom.update({
            where: {
                id: parseInt(id)
            },
            data: {
                roomID,
                roomname
            }
        })
        return res.status(200).json({
            message: "add classroom successful",
            body: classroomdata
        })
    } catch (error) {
        return res.status(500).json({
            message: "add classroom filaed",
            error: error.message,
        })
    }
}

exports.deleteclassroom = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedata = await prisma.classroom.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "delete classroom successfully",
            body: deletedata
        })
    } catch (error) {
        return res.status(500).json({
            message: "delete classroom filaed",
            error: error.message,
        })
    }
}

exports.fetchclassroom = async (req, res) => {
    try {
        const fetchdata = await prisma.classroom.findMany({

        })
        return res.status(200).json({
            message: "fetchimg classroom successfully",
            body: fetchdata
        })
    } catch (error) {
        return res.status(500).json({
            message: "fetching classroom filaed",
            error: error.message,
        })
    }
}
exports.fetchclassroomID = async (req, res) => {
    try {
        const {id} = req.params

        const fetchdata = await prisma.classroom.findMany({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "fetchimg classroom successfully",
            body: fetchdata
        })
    } catch (error) {
        return res.status(500).json({
            message: "fetching classroom filaed",
            error: error.message,
        })
    }
}

