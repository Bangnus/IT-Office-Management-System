const multer = require('multer');
const path = require('path');

// กำหนดที่เก็บไฟล์และชื่อไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // กำหนดที่เก็บไฟล์ (เช่น โฟลเดอร์ uploads)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // ตั้งชื่อไฟล์ใหม่เพื่อไม่ให้ทับไฟล์เดิม
    }
});

// สร้างตัวแปรสำหรับการอัพโหลด

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];  // ประเภทไฟล์ที่อนุญาต
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only image files are allowed'), false);  // หากไม่ใช่ประเภทไฟล์ที่อนุญาต
        }
        cb(null, true);  // อนุญาตให้ไฟล์ที่ตรงตามประเภท
    },
    limits: { fileSize: 5 * 1024 * 1024 },  // ขนาดไฟล์สูงสุด 5MB
});

module.exports = upload