const express = require('express')
require('dotenv').config();
const upload = require('../middlewares/upload')
const router = express.Router()
const {
    addequipment,
    editEquipment,
    deleteequipment,
    fetchequipment,
    fetchequipmentID
} = require('../controller/euqipment-controller')

router.post('/addequipment', upload.single('image'), addequipment)
router.put('/updateEquipment/:id', upload.single('image'), editEquipment)
router.delete('/deleteEqupment/:id', deleteequipment)
router.get('/equipment', fetchequipment)
router.get('/equipment/:id', fetchequipmentID)


module.exports = router