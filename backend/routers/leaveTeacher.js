const express = require('express');
require('dotenv').config();
const router = express.Router();
const {
    addLeave,
    fetchleaveID,
    editleave,
    deleteLeave,
    fetchleaveIDLeave

} = require('../controller/leaveTeacher-controller')

router.post('/addLeave', addLeave)
router.get('/fetchleaveID/:id', fetchleaveIDLeave)
router.get('/fetchleave/:id', fetchleaveID)
router.put('/editleave/:id', editleave)
router.delete('/deleteleave/:id', deleteLeave)

module.exports = router