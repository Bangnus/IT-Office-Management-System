const { PrismaClient } = require('@prisma/client')
const fs = require('fs');

const prisma = new PrismaClient();

exports.addequipment = async (req, res) => {
    try {
        const { name, number } = req.body;
        const image = req.file ? req.file.path : null;

        const addData = await prisma.equipment.create({
            data: {
                name,
                number,
                image,
            }
        })
        return res.status(200).json({
            message: "add equipment successfully",
            body: addData
        })
    } catch (error) {
        return res.status(500).json({
            message: "add equipment filaed",
            error: error.message
        })
    }
}

exports.editEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, number } = req.body;
        const image = req.file ? req.file.path : null;

        const existingequipment = await prisma.equipment.findFirst({
            where: {
                id: parseInt(id)
            },
        })

        if (!existingequipment) {
            return res.status(200).json({
                message: "equipment not found"
            })
        }

        if (existingequipment.image) {
            const oldImage = existingequipment.image;
            if (fs.existsSync(oldImage)) {
                fs.unlinkSync(oldImage);
            }
        }

        const updateequipment = await prisma.equipment.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                number,
                image
            }
        })
        return res.status(200).json({
            message: "update equipment successfully",
            body: updateequipment
        })
    } catch (error) {
        return res.status(500).json({
            message: "update equipment filaed",
            error: error.message
        })
    }
}

exports.deleteequipment = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteequipment = await prisma.equipment.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "delete equipment successfully",
            body: deleteequipment
        })
    } catch (error) {
        return res.status(500).json({
            message: "delete equipment filaed",
            error: error.message
        })
    }
}

exports.fetchequipment = async (req, res) => {
    try {
        const fetchdata = await prisma.equipment.findMany({

        })
        return res.status(200).json({
            message: "fetching equipment successfully",
            body: fetchdata
        })
    } catch (error) {
        return res.status(500).json({
            message: "feyching equipment filaed",
            error: error.message
        })
    }
}
exports.fetchequipmentID = async (req, res) => {
    try {
        const { id } = req.params
        const fetchdata = await prisma.equipment.findMany({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "fetching equipment successfully",
            body: fetchdata
        })
    } catch (error) {
        return res.status(500).json({
            message: "feyching equipment filaed",
            error: error.message
        })
    }
}
