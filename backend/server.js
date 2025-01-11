const express = require('express');
const cors = require('cors');
const { readdirSync } = require('fs');
const passport = require('passport');
const morgen = require('morgan');
const path = require('path');

require('dotenv').config();
require('./middlewares/authMiddleware')

const app = express();
const port = 5000;


app.use(express.json());
app.use(morgen('dev'));
app.use(cors());




app.get('/', async (req, res) => {
    try {
        return res.status(200).json({ message: 'Welcome to Node.js and Express API!' });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ให้สามารถเข้าถึงไฟล์ในโฟลเดอร์ uploads ได้

app.use('/api/auth', require('./routers/authenticate')); 
readdirSync('./routers').map((r) => app.use('/api', passport.authenticate('jwt', { session: false }), require(`./routers/` + r)));
console.log(readdirSync('./routers'))

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});