const express = require('express')
require('dotenv').config();
const {
    addvc,
    addclassnum,
    addstudent,
    editclassroom,
} = require('../controller/namageClass-controler')
const router = express.Router();

router.post('/addvc', addvc);
router.post('/addclassroom', addclassnum)
router.post('/addstudent', addstudent)

router.put('/editclassroom/:id', editclassroom)


module.exports = router
