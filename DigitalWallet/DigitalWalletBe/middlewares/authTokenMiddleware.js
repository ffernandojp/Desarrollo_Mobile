import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

/** Middleware to verify session */
export default function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer TOKEN"

    if (!token) return res.sendStatus(401); // No token provided

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user; // Save user info for use in other routes
        next(); // Proceed to the next middleware or route handler
    });
}


//** Function to generate JWT token */
export function generateAccessToken(user) {
  return jwt.sign(user, process.env.TOKEN_SECRET_KEY, { expiresIn: '1800s' }); // Token expires in 30 minutes
}