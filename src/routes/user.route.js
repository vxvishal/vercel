import express from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        jwt.sign(payload
            , `${process.env.JWT_SECRET}`
            , { expiresIn: 1000000 }
            , (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token,
                    message: 'User created successfully'
                });
            });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({
                message: 'User does not exist'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid password'
            });
        }

        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
        }

        jwt.sign(payload
            , `${process.env.JWT_SECRET}`
            , { expiresIn: 1000000 }
            , (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token,
                    message: 'User logged in successfully'
                });
            });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;