const express = require('express')
require('dotenv').config();
const router = express.Router();
 const {
    uploadimage,
    preview,
    previewID,
 } = require('../controller/uploadimage-controller')
const upload = require('../middlewares/upload')

router.post('/uploadimage',upload.single('image'), uploadimage)
router.get('/previewimage', preview)
router.get('/previewimage/:id', previewID)

module.exports = router
