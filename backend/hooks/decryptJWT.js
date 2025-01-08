const jwt = require('jsonwebtoken');
require('dotenv').config();

const DecryptToken = (req) => {
    try {
        // ตรวจสอบว่ามี Authorization header หรือไม่
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            console.error('Authorization header is missing');
            return null;
        }

        // แยก Token ออกจาก 'Bearer <token>'
        const token = authHeader.split(' ')[1];
        if (!token) {
            console.error('Token is missing from Authorization header');
            return null;
        }

        // ตรวจสอบและถอดรหัส Token
        const UserData = jwt.verify(token, process.env.SECRET_JWT);
        return UserData;
        
    } catch (error) {
        console.error('Error verifying token:', error.message);
        return null; // คืนค่า null หาก Token ไม่ถูกต้องหรือหมดอายุ
    }
};

module.exports = DecryptToken;
