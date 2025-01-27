const { PrismaClient } = require('@prisma/client');
const { json } = require('express');


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

exports.getvc = async (req, res) => {
    try {
        const resvc = await prisma.vc.findMany({

        })
        return res.status(200).json({
            message: "rsponse data successfully",
            body: resvc
        })
    } catch (error) {
        return res.status(500).json({
            message: "fetching data faild",
            error: error
        })
    }
}

exports.addclassroom = async (req, res) => {
    try {
        const { className, vcID, advisor } = req.body;

        const addclass = await prisma.classroomNumber.create({
            data: {
                className,
                vcID,
                advisor,
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

exports.editclassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const { className, advisor } = req.body;


        const editclassroom = await prisma.classroomNumber.update({
            where: {
                id: parseInt(id),
            },
            data: {
                className,
                advisor
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

exports.fetchclassroom = async (req, res) => {
    try {
        const fetchclass = await prisma.classroomNumber.findMany({

        })
        return res.status(200).json({
            message: "fetching class successfully",
            body: fetchclass
        })
    } catch (error) {
        return res.status(200), json({
            message: "fetching class error",
            error: error,
        })
    }
}
exports.fetchclassroomID = async (req, res) => {
    try {
        const { id } = req.params
        const fetchclass = await prisma.classroomNumber.findMany({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "fetching class successfully",
            body: fetchclass
        })
    } catch (error) {
        return res.status(200), json({
            message: "fetching class error",
            error: error,
        })
    }
}

exports.deleteclassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const fetchdata = await prisma.classroomNumber.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "delete classroom successfully",
            body: fetchdata,
        })
    } catch (error) {
        return res.status(200).json({
            message: "delete fail",
            error: error
        })
    }
}