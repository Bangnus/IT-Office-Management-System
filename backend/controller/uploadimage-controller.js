const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();


exports.uploadimage = async (req, res) => {
    try {
        const { classroomNumberID } = req.body;
        const image = req.file ? req.file.path : null;

        // ตรวจสอบว่า classroomNumberID ถูกส่งมาหรือไม่
        if (!classroomNumberID) {
            return res.status(400).json({
                message: "classroomNumberID is required"
            });
        }

        const classroomInt = parseInt(classroomNumberID, 10);

        // ใช้ findFirst เพื่อค้นหา image ที่มี classroomNumberID ตรงกัน
        const existingImage = await prisma.images.findFirst({
            where: { classroomNumberID: classroomInt }
        });

        if (existingImage) {
            // ลบภาพเก่าถ้ามี
            if (existingImage.image) {
                const oldImagePath = existingImage.image;
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // ลบไฟล์เก่า
                }
            }

            // ลบข้อมูลเก่าออกโดยใช้ id
            await prisma.images.delete({
                where: { id: existingImage.id } // ลบโดยใช้ id ของภาพ
            });
        }

        // เพิ่มข้อมูลใหม่
        const upload = await prisma.images.create({
            data: {
                image: image || null,
                classroomNumberID: classroomInt
            }
        });

        return res.status(200).json({
            message: "Create image successfully",
            body: upload,
        });

    } catch (error) {
        console.error("Error details:", error); // เพิ่มการ log error เพื่อดูรายละเอียด
        return res.status(500).json({
            message: "Create failed",
            error: error.message, // แสดงข้อความ error ที่ชัดเจน
        });
    }
};



exports.preview = async (req, res) => {
    try {
        const fetchdata = await prisma.images.findMany({
            include: {
                classroomNumber: true
            }
        })
        return res.status(200).json({
            message: "send data successfully",
            body: fetchdata,
        })
    } catch (error) {
        return res.status(500).json({
            message: "fetching data faild",
            error: error,
        })
    }
}

exports.previewID = async (req, res) => {
    try {
        const { id } = req.params;
        const fetchdata = await prisma.images.findMany({
            where: {
                classroomNumberID: parseInt(id)
            },
            include: {
                classroomNumber: true
            }
        })
        return res.status(200).json({
            message: "send data successfully",
            body: fetchdata,
        })
    } catch (error) {
        return res.status(500).json({
            message: "fetching data failed",
            error: error.message
        })
    }
}
