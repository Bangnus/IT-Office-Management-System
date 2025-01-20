const express = require('express')
require('dotenv').config();
const router = express.Router();
const {
    addTeacher,
    editTeacher,
    fetchTeacher,
    fetchTeacherID,
    deleteteacher
} = require('../controller/teacher-controller')
const upload = require('../middlewares/upload')


router.post('/addteacher', upload.single('TeacherImage'), addTeacher)
router.put('/editTeacher/:id', upload.single('TeacherImage'), editTeacher)
router.delete('/deleteTeacher/:id',deleteteacher)
router.get('/teacher', fetchTeacher)
router.get('/teacher/:id', fetchTeacherID)


module.exports = router