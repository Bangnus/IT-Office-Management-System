const express = require('express');
require('dotenv').config();
const router = express.Router();
const {
    addLeave,
    fetchleaveID

} = require('../controller/leaveTeacher-controller')

router.post('/addLeave', addLeave)
router.get('/fetchleave/:id', fetchleaveID)


module.exports = router