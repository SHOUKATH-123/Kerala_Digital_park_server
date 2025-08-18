import jwt from 'jsonwebtoken';
import config from '../../config/env.js';

class JwtToken {
    /**
     * Generate a JWT token, set it in httpOnly cookie
     * @param {string} userId - User's ID
     * @param {Response} res - Express response object
     * @returns {void}
     */
    generateToken(userId, res) {

        if (!userId) {
            throw new Error('User ID is required to generate token.');
        }

        // Build the JWT payload
        const payload = { userId };

        // Sign the JWT with secret and expiry
        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES });
        //  console.log(token,userId); 

        // Set the token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            // secure: false,
            secure: true,       // For localhost; set true in production
            // sameSite: 'lax',     // Helps prevent CSRF (good dev default)?
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in ms
        });
    }
    logout(res) {
        res.clearCookie('token', {
            httpOnly: true,
            // secure: false,
            secure: true,    // true in production with HTTPS
            sameSite: 'none',
            // sameSite: 'lax'
        });

        return {
            status: 200,
            message: 'Logout successful. Token cleared from cookies.'
        };
    }
}

export default JwtToken;
