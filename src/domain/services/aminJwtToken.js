import jwt from 'jsonwebtoken';
import config from '../../config/env.js';

class AdminJwtToken {
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
        res.cookie('AdminToken', token, {
            httpOnly: true,          // Prevents client-side JS access
            secure: true,            // Ensures cookie is sent over HTTPS (MUST be true in production)
            sameSite: 'none',        // Allow cross-origin requests (important if frontend & backend are on different domains)
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in ms
        });
    }
    logout(res) {
        res.clearCookie('AdminToken', {
            httpOnly: true,
            secure: true,    // true in production with HTTPS
            sameSite: 'none'
        });

        return {
            status: 200,
            message: 'Logout successful. Token cleared from cookies.'
        };
    }
}

export default AdminJwtToken;
