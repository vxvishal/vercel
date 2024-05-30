import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { configDotenv } from 'dotenv';
configDotenv();

export default async function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}