const express = require('express')
require('dotenv').config();
const {
    addvc,
    addclassroom,
    editclassroom,
    getvc,
    fetchclassroom,
    fetchclassroomID,
    deleteclassroom
} = require('../controller/manageClass-controler')
const router = express.Router();

router.post('/addvc', addvc);
router.post('/addclassroom', addclassroom)

router.get('/fetchVC', getvc)
router.get('/fetchclassroom', fetchclassroom)
router.get('/fetchclassroom/:id', fetchclassroomID)

router.put('/editclassroom/:id', editclassroom)

router.delete('/deleteclassroom/:id', deleteclassroom)


module.exports = router
