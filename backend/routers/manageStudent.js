const express = require('express')
require('dotenv').config();
const {
    addstudent,
    editstudent,
    deletestudent,
    students,
    studentsID,
} = require('../controller/manageStudent-controller')
const upload = require('../middlewares/upload')
const router = express.Router();

router.post('/addstudent',upload.single('image'), addstudent)
router.put('/editstudent/:id', editstudent)
router.delete('/deletestudent', deletestudent)
router.get('/students', students)
router.get('/students/:id', studentsID)

module.exports = router
