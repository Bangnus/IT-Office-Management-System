const express = require('express')
require('dotenv').config();
const {
    addstudent,
    editstudent,
    deletestudent,
    students,
    studentsID,
    fetchEditstudentID,
} = require('../controller/manageStudent-controller')
const router = express.Router();

router.post('/addstudent', addstudent)
router.put('/editstudent/:id', editstudent)

router.delete('/deletestudent/:id', deletestudent)

router.get('/students', students)
router.get('/students/:id', studentsID)
router.get('/fetchEditstudent/:id', fetchEditstudentID)

module.exports = router
