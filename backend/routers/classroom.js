const express = require('express')
require('dotenv').config();
const router = express.Router();
const {
    addclassroom,
    Editlassroom,
    deleteclassroom,
    fetchclassroom,
    fetchclassroomID
} = require('../controller/classroom-controller')


router.post('/addclassroom', addclassroom)
router.delete('/deleteclassroom/:id', deleteclassroom)
router.put('/editclassroom/:id', Editlassroom)
router.get('/classroom', fetchclassroom)
router.get('/classroom/:id', fetchclassroomID)

module.exports = router