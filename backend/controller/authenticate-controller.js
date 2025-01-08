const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const DecryptToken = require('../hooks/decryptJWT')
const prisma = new PrismaClient();
const SecretJWT = process.env.SECRET_JWT;
const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.signin = async (req, res, next) => {
    try {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) return next(err);
            if (user) { 
                const authToken = jwt.sign({ user: user }, SecretJWT, { expiresIn: '9999 years' });
                return res.status(200).json({
                    message: "Login Successful",
                    body: user,
                    authToken: authToken
                })
            } else {
                return res.status(422).json(info);
            }
        })(req, res, next);
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Invalid username or password",
            error: error,
        })
    }
}

exports.signup = async (req, res) => {
    try {
        const { username, firstName, lastName, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const recheckuser = await prisma.users.findFirst({
            where: {
                username: username
            }
        });

        if (recheckuser) throw 'this user already in a system';

        const newuser = await prisma.users.create({
            data: {
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: hashPassword
            }
        })
        return res.status(201).json({
            message: "create user successfully",
            body: newuser,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "signup failed",
            error: error,
        })
    }
}

exports.currenuser = async (req, res) => {
    try {
        const userData = DecryptToken(req);

        if (!userData) {
            return res.status(500).json({
                error: "Authorization header is missing"
            })
        }

        return res.status(200).json({
            message: "Curren user successfully",
            body: userData
        });
    } catch (error) {
        return res.status(500).json({
            message: "Filed to get curren user",
            error: error,
        })
    }
}