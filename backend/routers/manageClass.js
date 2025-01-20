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
router.post('/addclass', addclassroom)

router.get('/fetchVC', getvc)
router.get('/fetchclass', fetchclassroom)
router.get('/fetchclass/:id', fetchclassroomID)

router.put('/editclass/:id', editclassroom)

router.delete('/deleteclass/:id', deleteclassroom)


module.exports = router
