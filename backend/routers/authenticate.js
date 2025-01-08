const express = require('express');
require('dotenv').config();
const {
    signup,
    signin,
    currenuser,
} = require('../controller/authenticate-controller')
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin)
router.get('/currenuser', currenuser)


module.exports = router